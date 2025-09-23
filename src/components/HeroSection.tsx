import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const HeroSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format phone number for WhatsApp (remove formatting and add +55)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const whatsappNumber = `+55${cleanPhone}`;

    // Always show success message and redirect
    toast({
      title: "Inscrição realizada com sucesso!",
      description: "Você será redirecionado em instantes...",
    });

    // Submit to Google Sheets (avoid CORS using URL-encoded + no-cors)
    try {
      const payload = new URLSearchParams({
        nome: formData.name,
        email: formData.email,
        whatsapp: whatsappNumber,
      });

      await fetch('https://script.google.com/macros/s/AKfycbyeWl0rwa6CwcUacKgsJwbnqocnlxNQY3n3LonibAmyQEBpKvni2RZ3E1V5XoKIM7m6/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: payload.toString(),
      });
    } catch (error) {
      // Silently log the error but don't show it to the user
      console.log('Google Sheets submission failed:', error);
    }

    // Always redirect to the thank you page after 2 seconds
    setTimeout(() => {
      window.location.href = 'https://obrigado26.institutodespertamente.site';
    }, 2000);

    setIsSubmitting(false);
  };

  const formatPhone = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Apply Brazilian phone mask
    if (digits.length <= 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-10">{/* Reduced py-20 to py-10 */}
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background" />
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="text-foreground">Curso Gratuito de</span>
          <br />
          <span className="text-primary animate-pulse-slow">Psicanálise Integrativa!</span>
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl lg:text-3xl mb-8 text-muted-foreground font-medium">
          Uma sequência de 3 aulas ONLINE. 100% Gratuitas com Certificado + Material.
        </h2>

        {/* Event details */}
        <div className="mb-12 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <p className="text-lg md:text-xl font-semibold text-foreground">
            DIA 07, 08 E 09 DE OUTUBRO
          </p>
          <p className="text-md md:text-lg text-accent font-medium">
            AO VIVO NO YOUTUBE ÀS 20 HORAS
          </p>
        </div>

        {/* Registration form */}
        <div className="max-w-md mx-auto bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="sr-only">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Insira seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-form w-full text-lg"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="sr-only">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Insira seu melhor e-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-form w-full text-lg"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="sr-only">WhatsApp</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                  BR +55
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="WhatsApp"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="input-form w-full text-lg rounded-l-none"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="btn-primary w-full text-xl py-6 animate-glow"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'ENVIANDO...' : 'INSCREVER-SE AGORA!'}
            </Button>
          </form>

          {/* Legal notice */}
          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
            De acordo com a lei 12.965/2014 e 13.709/2018, autorizo enviarem comunicações por e-mail ou qualquer outro meio e concordo com a política de privacidade.
          </p>

          {/* Bonus */}
          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm font-medium text-foreground">
              <span className="text-accent">Cadastre-se agora e ganhe o EBOOK:</span>
              <br />
              <span className="text-primary">Desenvolvimento da Personalidade.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
