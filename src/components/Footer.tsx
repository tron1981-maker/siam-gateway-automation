const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-heading text-lg">
            Siam Elite <span className="text-gradient-gold">Gateway</span>
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 Siam Elite Gateway Co., Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
