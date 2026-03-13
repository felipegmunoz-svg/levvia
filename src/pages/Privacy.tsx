import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background gradient-page pb-24">
      <header className="px-6 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={22} strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-light text-foreground">Política de Privacidade</h1>
      </header>

      <main className="px-6 space-y-6">
        <section className="glass-card p-5 space-y-4">
          <p className="text-xs text-muted-foreground">Última atualização: 13 de março de 2026</p>

          <div className="space-y-3 text-sm text-foreground/90 leading-relaxed">
            <h2 className="text-base font-medium text-foreground">1. Dados Coletados</h2>
            <p>Coletamos as seguintes informações fornecidas por você durante o cadastro e onboarding: nome, email, idade, sexo, peso, altura, nível de atividade física, condições de saúde, nível de dor, áreas afetadas, objetivo, restrições e preferências alimentares.</p>

            <h2 className="text-base font-medium text-foreground">2. Finalidade</h2>
            <p>Seus dados são utilizados exclusivamente para personalizar sua experiência no Levvia, incluindo a seleção de exercícios, receitas e hábitos adequados ao seu perfil.</p>

            <h2 className="text-base font-medium text-foreground">3. Armazenamento</h2>
            <p>Seus dados são armazenados de forma segura em servidores protegidos com criptografia. Não compartilhamos suas informações pessoais com terceiros.</p>

            <h2 className="text-base font-medium text-foreground">4. Dados de Saúde</h2>
            <p>Informações de saúde (condições médicas, nível de dor, áreas afetadas) são tratadas com sensibilidade especial e utilizadas apenas para personalização do conteúdo dentro do aplicativo.</p>

            <h2 className="text-base font-medium text-foreground">5. Seus Direitos</h2>
            <p>Você tem direito a acessar, corrigir ou excluir seus dados a qualquer momento. Para exercer esses direitos, utilize as configurações do aplicativo ou entre em contato conosco.</p>

            <h2 className="text-base font-medium text-foreground">6. Cookies e Rastreamento</h2>
            <p>O Levvia utiliza armazenamento local (localStorage) para manter seu progresso e preferências. Não utilizamos cookies de rastreamento de terceiros.</p>

            <h2 className="text-base font-medium text-foreground">7. Segurança</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração ou destruição.</p>

            <h2 className="text-base font-medium text-foreground">8. Alterações</h2>
            <p>Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através do aplicativo.</p>

            <h2 className="text-base font-medium text-foreground">9. Contato</h2>
            <p>Para questões sobre privacidade: <span className="text-secondary">privacidade@levvia.app</span></p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Privacy;
