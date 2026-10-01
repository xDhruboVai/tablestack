/**
 * Questions and answers for /faq. Plain text only: the same text is sent to Google as FAQ data,
 * so keep every answer true and free of promises we can't keep.
 */
export const faqs = [
  {
    q: "What is TableStack?",
    a: "TableStack is a small web development team based in Dhaka, Bangladesh. We design and build websites, web apps, online shops, databases and AI tools for businesses. The name comes from a table plus a tech stack: what your customers see on top, and the technology underneath. You may also see it written as Table Stack or TableStack BD.",
  },
  {
    q: "What services does TableStack offer?",
    a: "Three areas: websites and web apps (including online shops and design for phones and computers), databases and data work (design, moving old data, backups), and AI and automation (assistants and tools that take over repetitive work).",
  },
  {
    q: "How much does a website cost in Bangladesh?",
    a: "It depends on the size of the site and what it has to do. We agree the pages, features and timeline with you first and then give a fixed quote before any work starts. Our project form has ranges from under Tk 25,000 to Tk 50,000 and above. Our blog post on website costs in Bangladesh explains what drives the price.",
  },
  {
    q: "How long does it take to build a website?",
    a: "It depends on the scope. A small site is usually a matter of weeks, and larger systems take longer. The timeline is agreed with you before we start, as part of the quote.",
  },
  {
    q: "How does a project with TableStack run?",
    a: "In four steps. First we discuss your business and agree on pages, features, timeline and a quote. Then you see the layouts before development. Next we build it and share a working preview. Finally we test, launch and agree on any continued support.",
  },
  {
    q: "Can you build websites in both Bangla and English?",
    a: "Yes. Both of our published projects, Smashed Burgers and Pinewood, are available in English and Bangla, with a switch in the header.",
  },
  {
    q: "Will my website work well on mobile phones?",
    a: "Yes. We build for phones first, because that is where most visitors come from, and then make sure the same site works on tablets and computers.",
  },
  {
    q: "Can I update the website myself after launch?",
    a: "Yes, where that is part of the agreed scope. Tell us what you expect to change often, such as products, prices or opening hours, and we set the site up so your team can edit those parts.",
  },
  {
    q: "Who owns the website once it is finished?",
    a: "You do. Your domain, your content and your accounts stay in your name.",
  },
  {
    q: "Do you provide support after the website goes live?",
    a: "We agree any updates or continued support with you at launch, so you know what is covered and what is not.",
  },
  {
    q: "What technology does TableStack use?",
    a: "Mainly Next.js, React and TypeScript for the site, Supabase and PostgreSQL for data, Tailwind CSS for styling and Vercel for hosting. We explain our choices in plain language, so you do not need to know these tools.",
  },
  {
    q: "How do I start a project with TableStack?",
    a: "Send a short brief through the contact page, email tablestackbd@gmail.com, book a call, or message us on WhatsApp. We get back to you to talk through scope and next steps.",
  },
] as const;
