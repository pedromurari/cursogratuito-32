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
    
    // Validate phone number format before submitting
    if (!isValidPhone(formData.phone)) {
      toast({
        title: "Número de telefone inválido",
        description: "Por favor, insira um número no formato: (99) 9999-9999 ou (99) 9 9999-9999",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    // Format phone number for WhatsApp (remove formatting and add +55)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const whatsappNumber = `+55${cleanPhone}`;

    // Always show success message and redirect
    toast({
      title: "Inscrição realizada com sucesso!",
      description: "Você será redirecionado em instantes...",
    });

    // Submit to Google Sheets via hidden iframe (bypasses CORS/redirect issues)
    try {
      const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx9r60iZK31nvvfD-oUQPyu0asTYdCQJcRZ-qjomNV8dXs3CfG73DhSLDnla5J1R_dD4A/exec';

      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-sheets-submit';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = SHEETS_URL;
      form.target = 'hidden-sheets-submit';

      const fields: Record<string, string> = {
        nome: formData.name,
        email: formData.email,
        whatsapp: whatsappNumber,
      };
      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      }, 3000);
    } catch (error) {
      console.log('Google Sheets submission failed:', error);
    }

    // Always redirect to the thank you page after 2 seconds
    setTimeout(() => {
      window.location.href = 'https://obrigado31.institutodespertamente.site/';
    }, 2000);

    setIsSubmitting(false);
  };

  const formatPhone = (value: string) => {
    // Remove all non-digits
    let digits = value.replace(/\D/g, '');
    
    // Prevent +55 duplicated DDI: If user pastes +55 and length > 11, strip it.
    if (digits.startsWith('55') && digits.length > 11) {
      digits = digits.slice(2);
    }
    
    // Limit to maximum 11 digits (DDD + 9 digits)
    const limitedDigits = digits.slice(0, 11);
    
    // Apply Brazilian phone mask based on length
    if (limitedDigits.length <= 2) {
      return limitedDigits;
    } else if (limitedDigits.length <= 3) {
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2)}`;
    } else if (limitedDigits.length <= 7) {
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2)}`;
    } else if (limitedDigits.length <= 10) {
      // Format for 8-digit numbers: (11) 7537-9719
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 6)}-${limitedDigits.slice(6)}`;
    } else {
      // Format for 9-digit numbers: (11) 9 7537-9719
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 3)} ${limitedDigits.slice(3, 7)}-${limitedDigits.slice(7)}`;
    }
  };

  const isValidPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    // Accept 10 digits (DDD + 8 digits) or 11 digits (DDD + 9 digits)
    return digits.length === 10 || digits.length === 11;
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
          <p className="text-sm md:text-base font-bold text-primary mb-2 tracking-widest">
            TURMA #31
          </p>
          <p className="text-lg md:text-xl font-semibold text-foreground">
            DIAS 14, 15 E 16 DE ABRIL
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
              <div className="space-y-2">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                    BR +55
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="WhatsApp - (99) 9999-9999"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`input-form w-full text-lg rounded-l-none ${
                      formData.phone && !isValidPhone(formData.phone) 
                        ? 'border-red-500 focus:border-red-500' 
                        : ''
                    }`}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  Formatos aceitos: <span className="text-accent">(99) 9999-9999</span> ou <span className="text-accent">(99) 9 9999-9999</span>
                </p>
                {formData.phone && !isValidPhone(formData.phone) && (
                  <p className="text-xs text-red-500 text-left">
                    Número inválido. Use o formato correto.
                  </p>
                )}
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
