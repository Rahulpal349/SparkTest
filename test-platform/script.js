gsap.registerPlugin(ScrollTrigger);

// Hero Entrance Animation (Home Only)
if (document.querySelector('.hero-content')) {
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    
    heroTl.from(".fixed-top", { y: -100, opacity: 0 })
          .from(".badge", { y: 20, opacity: 0 }, "-=0.5")
          .from("h1", { y: 30, opacity: 0 }, "-=0.7")
          .from(".hero-description", { y: 20, opacity: 0 }, "-=0.7")
          .from(".hero-ctas", { y: 20, opacity: 0 }, "-=0.7")
          .from(".hero-content", { y: 30, opacity: 0, duration: 1 }, "-=0.8");
}
