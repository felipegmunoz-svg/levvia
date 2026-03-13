import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background gradient-page pb-24">
      <header className="px-6 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={22} strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-light text-foreground">Termos de Uso</h1>
      </header>

      <main className="px-6 space-y-6">
        <section className="glass-card p-5 space-y-4">
          <p className="text-xs text-muted-foreground">Última atualização: 13 de março de 2026</p>

          <div className="space-y-3 text-sm text-foreground/90 leading-relaxed">
            <h2 className="text-base font-medium text-foreground">1. Aceitação dos Termos</h2>
            <p>Ao utilizar o aplicativo Levvia, você concorda com estes Termos de Uso. Se não concordar com algum dos termos, não utilize o aplicativo.</p>

            <h2 className="text-base font-medium text-foreground">2. Descrição do Serviço</h2>
            <p>O Levvia é um aplicativo de apoio ao bem-estar focado em práticas anti-inflamatórias, exercícios personalizados, receitas e hábitos saudáveis. O conteúdo é educativo e complementar ao acompanhamento profissional.</p>

            <h2 className="text-base font-medium text-foreground">3. Aviso Médico</h2>
            <p>O Levvia <strong>não substitui</strong> tratamento médico, nutricional ou fisioterapêutico. Todas as informações são de caráter informativo. Consulte seu médico antes de iniciar qualquer programa de exercícios ou mudança alimentar.</p>

            <h2 className="text-base font-medium text-foreground">4. Conta do Usuário</h2>
            <p>Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.</p>

            <h2 className="text-base font-medium text-foreground">5. Uso Adequado</h2>
            <p>O uso do aplicativo deve respeitar a legislação vigente. É proibido utilizar o app para fins ilegais, compartilhar conteúdo ofensivo ou tentar acessar dados de outros usuários.</p>

            <h2 className="text-base font-medium text-foreground">6. Propriedade Intelectual</h2>
            <p>Todo o conteúdo do Levvia (textos, imagens, exercícios, receitas) é protegido por direitos autorais. A reprodução sem autorização é proibida.</p>

            <h2 className="text-base font-medium text-foreground">7. Alterações</h2>
            <p>Reservamo-nos o direito de atualizar estes termos. Alterações significativas serão comunicadas pelo aplicativo.</p>

            <h2 className="text-base font-medium text-foreground">8. Contato</h2>
            <p>Para dúvidas sobre estes termos, entre em contato pelo email: <span className="text-secondary">contato@levvia.app</span></p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Terms;
