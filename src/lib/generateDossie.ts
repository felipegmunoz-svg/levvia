import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DayHistoryItem } from "@/hooks/useCelebrationData";
import logoUrl from "@/assets/logo_livvia_azul.png";

interface GenerateDossieParams {
  userName: string;
  totalLiters: number;
  totalMovementMinutes: number;
  day1Score: number | null;
  day14Score: number | null;
  lightnessScores: { day: number; score: number }[];
  dayHistory: DayHistoryItem[];
  doctorMessage: string;
}

export async function generateDossie(params: GenerateDossieParams): Promise<void> {
  const {
    userName,
    totalLiters,
    totalMovementMinutes,
    day1Score,
    day14Score,
    lightnessScores,
    dayHistory,
    doctorMessage,
  } = params;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 14;
  const marginR = 14;
  const contentW = pageW - marginL - marginR;

  // ── Cores ──────────────────────────────────────────────
  const blue: [number, number, number] = [30, 111, 160];
  const blueLight: [number, number, number] = [224, 240, 250];
  const gray: [number, number, number] = [120, 120, 120];
  const dark: [number, number, number] = [30, 30, 30];

  // ── Cabeçalho ──────────────────────────────────────────
  try {
    doc.addImage(logoUrl, "PNG", marginL, 10, 36, 12);
  } catch (_) {
    // Logo não carregada — continuar sem ela
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...blue);
  doc.text("Dossiê de Autocuidado", 55, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  const completionDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`${userName}  ·  Jornada de 14 Dias com Levvia  ·  ${completionDate}`, 55, 25);

  doc.setDrawColor(...blue);
  doc.setLineWidth(0.5);
  doc.line(marginL, 30, pageW - marginR, 30);

  let curY = 38;

  // ── Seção 1: Conquistas ────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...dark);
  doc.text("Conquistas da Jornada", marginL, curY);
  curY += 6;

  const metrics = [
    { icon: "💧", value: `${totalLiters}L`, label: "água ingerida" },
    { icon: "🏃", value: `${totalMovementMinutes}min`, label: "de movimento" },
    {
      icon: "📈",
      value: `${day1Score ?? "—"} → ${day14Score ?? "—"}`,
      label: "evolução leveza",
    },
    {
      icon: "✅",
      value: `${dayHistory.filter((d) => d.nightDone).length}/14`,
      label: "dias concluídos",
    },
  ];

  const cardW = contentW / 4 - 2;
  metrics.forEach((m, i) => {
    const x = marginL + i * (cardW + 2.5);
    doc.setFillColor(...blueLight);
    doc.roundedRect(x, curY, cardW, 20, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...blue);
    doc.text(m.value, x + cardW / 2, curY + 9, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...gray);
    doc.text(m.label, x + cardW / 2, curY + 15, { align: "center" });
  });
  curY += 26;

  // ── Seção 2: Gráfico de leveza ─────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...dark);
  doc.text("Evolução do Score de Leveza (Escala 1–10)", marginL, curY);
  curY += 4;

  if (lightnessScores.length >= 2) {
    const chartX = marginL;
    const chartY = curY;
    const chartW = contentW;
    const chartH = 40;

    // Fundo
    doc.setFillColor(248, 252, 255);
    doc.rect(chartX, chartY, chartW, chartH, "F");
    doc.setDrawColor(200, 220, 235);
    doc.setLineWidth(0.2);
    doc.rect(chartX, chartY, chartW, chartH, "S");

    // Eixo Y: linhas de grade para 2, 4, 6, 8, 10
    doc.setDrawColor(220, 235, 245);
    doc.setLineWidth(0.1);
    [2, 4, 6, 8, 10].forEach((v) => {
      const gy = chartY + chartH - ((v / 10) * chartH);
      doc.line(chartX, gy, chartX + chartW, gy);
      doc.setFontSize(6);
      doc.setTextColor(...gray);
      doc.text(String(v), chartX - 4, gy + 1, { align: "right" });
    });

    // Linha do gráfico
    doc.setDrawColor(...blue);
    doc.setLineWidth(0.8);

    const toX = (day: number) =>
      chartX + ((day - 1) / 13) * chartW;
    const toY = (score: number) =>
      chartY + chartH - (score / 10) * chartH;

    for (let i = 1; i < lightnessScores.length; i++) {
      const prev = lightnessScores[i - 1];
      const curr = lightnessScores[i];
      doc.line(toX(prev.day), toY(prev.score), toX(curr.day), toY(curr.score));
    }

    // Pontos
    doc.setFillColor(...blue);
    lightnessScores.forEach(({ day, score }) => {
      doc.circle(toX(day), toY(score), 1.2, "F");
    });

    // Rótulos do eixo X
    doc.setFontSize(6);
    doc.setTextColor(...gray);
    [1, 7, 14].forEach((d) => {
      doc.text(`D${d}`, toX(d), chartY + chartH + 4, { align: "center" });
    });

    curY += chartH + 8;
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text("Dados insuficientes para gerar o gráfico.", marginL, curY + 6);
    curY += 14;
  }

  // ── Seção 3: Mensagem para o médico ───────────────────
  if (doctorMessage.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...dark);
    doc.text("Mensagem da Paciente ao Profissional de Saúde", marginL, curY);
    curY += 5;

    doc.setDrawColor(...blue);
    doc.setLineWidth(0.4);
    doc.setFillColor(248, 252, 255);
    const msgLines = doc.splitTextToSize(doctorMessage, contentW - 8);
    const msgH = msgLines.length * 4.5 + 8;
    doc.roundedRect(marginL, curY, contentW, msgH, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    doc.text(msgLines, marginL + 4, curY + 6);
    curY += msgH + 6;
  }

  // ── Seção 4: Histórico dia a dia ───────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...dark);
  doc.text("Histórico Dia a Dia", marginL, curY);
  curY += 4;

  autoTable(doc, {
    startY: curY,
    head: [["Dia", "Score Leveza", "Água (ml)", "Notas do Diário", "Concluído"]],
    body: dayHistory.map((d) => [
      `Dia ${d.day}`,
      d.lightnessScore != null ? String(d.lightnessScore) : "—",
      d.waterMl > 0 ? `${d.waterMl}ml` : "—",
      d.notes || "—",
      d.nightDone ? "✅" : "—",
    ]),
    headStyles: {
      fillColor: blue,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: dark },
    alternateRowStyles: { fillColor: [240, 247, 252] },
    columnStyles: {
      0: { cellWidth: 14 },
      1: { cellWidth: 22, halign: "center" },
      2: { cellWidth: 22, halign: "center" },
      3: { cellWidth: 100 },
      4: { cellWidth: 16, halign: "center" },
    },
    margin: { left: marginL, right: marginR },
  });

  // ── Rodapé em todas as páginas ─────────────────────────
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(200, 220, 235);
    doc.setLineWidth(0.3);
    doc.line(marginL, pageH - 18, pageW - marginR, pageH - 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...gray);
    const disclaimer =
      "Este documento é um compilado de dados de autocuidado registrados voluntariamente pela usuária no aplicativo Levvia. " +
      "Ele não substitui o diagnóstico médico e deve ser utilizado apenas como material de apoio para consulta com profissionais de saúde qualificados.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, contentW);
    doc.text(disclaimerLines, marginL, pageH - 14);
    doc.setFontSize(7);
    doc.setTextColor(...blue);
    doc.text(`Pág. ${p} de ${totalPages}`, pageW - marginR, pageH - 5, { align: "right" });
  }

  // ── Salvar ─────────────────────────────────────────────
  const safeName = userName.toLowerCase().replace(/\s+/g, "-");
  doc.save(`dossie-levvia-${safeName}.pdf`);
}