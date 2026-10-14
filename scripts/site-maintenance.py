from pathlib import Path
import html, json, re

BASE="https://mudercrowlabs.in"
ROOT=Path(".")
# 50 additional useful editorial pages. Seven separate founder articles follow below.
TOPICS=[
("performance-marketing-basics","Performance Marketing: A Practical Beginner's Guide","Performance Marketing","Performance marketing connects ad spend to measurable business actions. It works best when audience, offer, creative, landing page, tracking and follow-up are treated as one system."),
("meta-ads-campaign-structure","How to Structure a Meta Ads Campaign","Paid Advertising","A campaign structure should make the goal and learning clear. Separate campaigns when objectives or audiences genuinely need different optimisation."),
("google-ads-for-small-business","Google Ads for Small Businesses","Paid Advertising","Search advertising can reach people already expressing intent. Start with relevant queries, a focused landing page and a realistic way to measure qualified enquiries."),
("reduce-cost-per-lead","Reduce Cost Per Lead Without Chasing Cheap Leads","Paid Advertising","Cheap leads are not automatically good leads. Measure lead quality, contactability, sales progress and customer value alongside platform CPL."),
("creative-testing-framework","A Practical Creative Testing Framework","Creative Strategy","Creative testing is structured learning: write a hypothesis, change one meaningful idea and evaluate the result against the same objective."),
("landing-page-conversion","Landing Page Optimisation Checklist","Conversion","A landing page should match the ad promise, explain the offer, build trust and make the next step easy, especially on mobile."),
("marketing-funnel-explained","Marketing Funnels Explained","Growth Marketing","A funnel maps how people move from awareness to action and retention. The useful question is where people hesitate and what evidence they need next."),
("lead-qualification","How to Qualify Leads Before Sales Follow-Up","Lead Generation","Qualification helps teams prioritise enquiries by fit, intent and readiness without collecting personal information they do not need."),
("crm-for-small-business","Why Small Businesses Need a CRM","CRM","A CRM provides one reliable place to track contacts, conversations, next actions and outcomes. It should simplify follow-up rather than create admin."),
("whatsapp-lead-follow-up","WhatsApp Follow-Up for Business Leads","CRM","WhatsApp can support convenient follow-up when people expect it. Respond promptly, keep messages useful, respect opt-outs and track the next action."),
("marketing-automation-basics","Marketing Automation: What to Automate First","Automation","Start automation with repetitive, dependable tasks such as lead acknowledgement, reminders, routing and internal alerts. Keep humans responsible for important decisions."),
("lead-intelligence-explained","What Is Lead Intelligence?","Lead Intelligence","Lead Intelligence brings together relevant prospect signals and interaction history to help teams decide what to do next. Recommendations should be explainable and useful."),
("build-lead-intelligence-product","How to Build a Lead Intelligence Product","Lead Intelligence","Begin with one decision to improve, such as prioritising follow-up. Define the user, evidence, workflow and success measure before building dashboards."),
("lead-scoring-model","Lead Scoring for Small Teams","Lead Intelligence","A lead score estimates which enquiries deserve attention first. Start with transparent fit, intent and engagement signals, then compare scores with actual outcomes."),
("ai-software-business","How AI Software Can Improve Business Workflows","AI Software","AI software can help with summarising, classification, drafting and search. It needs clear tasks, appropriate data and human review for consequential decisions."),
("ai-marketing-workflows","AI Workflows for Modern Marketing Teams","AI Marketing","AI can support research, content variations and campaign analysis. People still need to check facts, brand voice, privacy and final decisions."),
("ai-tools-for-small-business","AI Tools for Small Businesses: Where to Start","AI Tools","Choose tools by the job they help complete, not the hype around them. Test one real workflow and measure quality as well as time saved."),
("ai-search-optimization","AI Search Optimisation: A Practical Overview","SEO and AI Search","AI search visibility starts with clear, credible, accessible information. Publish original explanations and make your organisation, authors and sources easy to understand."),
("seo-for-small-business","SEO for Small Businesses","SEO","SEO helps relevant people find useful pages. Start with crawlability, clear service pages, helpful content, internal links and accurate local information."),
("aeo-and-geo-explained","AEO and GEO: What They Mean for Content","SEO and AI Search","AEO and GEO describe efforts to make information easier for answer engines and generative systems to understand. Treat them as good information design, not ranking guarantees."),
("local-seo-checklist","Local SEO Checklist for Service Businesses","SEO","Local SEO helps nearby customers understand who you serve and why to contact you. Keep business details consistent and request genuine reviews without incentives."),
("technical-seo-basics","Technical SEO Basics for Website Owners","SEO","Technical SEO removes barriers to discovery. Check status codes, canonicals, mobile layout, page speed, internal links and sitemap accuracy."),
("seo-content-clusters","How to Build an SEO Content Cluster","SEO","A content cluster connects a strong guide with supporting pages. Each article should answer a distinct question and link naturally to related resources."),
("blogging-for-business","How Blogging Supports Business Growth","Content Marketing","A business blog is valuable when it answers customer questions and helps people make decisions. Useful, original pages beat repetitive keyword pages."),
("content-strategy-framework","A Practical Content Strategy Framework","Content Marketing","Content strategy connects audience needs, business goals, editorial themes, distribution and measurement. Give each piece a clear job."),
("social-media-content-pillars","How to Choose Social Media Content Pillars","Social Media","Content pillars create consistency without making every post identical. Consider education, proof, perspective, process and community."),
("instagram-marketing-business","Instagram Marketing for Businesses","Social Media","Instagram works best when the profile explains what the business does and who it helps. Combine useful Reels, strong creative and a relevant next step."),
("linkedin-personal-brand","LinkedIn Personal Branding: A Practical Guide","Personal Branding","A useful LinkedIn presence communicates expertise and point of view. Share specific lessons, show process and build relationships rather than posting generic advice."),
("short-form-video-strategy","How to Plan Short-Form Video Content","Video Strategy","Short-form video needs one clear idea, a strong opening, readable visuals and a useful ending. Plan for the viewer, not only a trend."),
("influencer-marketing-basics","How to Plan an Influencer Marketing Campaign","Influencer Marketing","Begin with audience fit and campaign purpose. Agree on deliverables, usage rights, disclosure, tracking and success criteria before production."),
("brand-positioning-explained","Brand Positioning: Make a Business Distinct","Brand Strategy","Positioning explains who a business serves, which problem it solves and why the alternative is less suitable. Design becomes sharper when this is clear."),
("brand-identity-vs-logo","Brand Identity vs Logo","Branding and Design","A logo is one part of identity. Typography, colour, imagery, language and consistent use make a brand recognisable across touchpoints."),
("branding-for-startups","Branding for Startups on a Practical Budget","Branding and Design","Early branding should help people recognise, understand and trust the offer. Prioritise positioning and a flexible identity before expensive decoration."),
("packaging-design-principles","Packaging Design Principles for Products","Product Design","Packaging must work on a shelf, in a photograph, during shipping and in a customer's hands. Design around the buyer and production constraints."),
("graphic-design-for-business","How Graphic Design Supports Business Communication","Graphic Design","Graphic design organises information so people can notice, understand and remember it. Design decisions should follow the message and audience."),
("website-design-for-conversion","Website Design That Supports Conversion","Web Design","A business website should explain the offer, establish trust and guide visitors to a useful next step. Clear hierarchy and mobile performance are foundational."),
("ux-research-basics","UX Research Basics for Product Teams","UX Design","UX research helps teams learn how people behave and where a product causes confusion. Small, well-planned usability sessions can reveal assumptions."),
("product-development-roadmap","A Practical Roadmap for Developing a Product","Product Development","Reduce product uncertainty in stages: understand the user, define the problem, test the concept, build a small version and learn from use."),
("saas-mvp-planning","How to Plan a SaaS MVP Without Overbuilding","SaaS","An MVP should test the riskiest assumption with the smallest useful experience. A long feature list is not a substitute for a clear problem."),
("startup-market-validation","How to Validate a Business Idea Before Building","Entrepreneurship","Market validation looks for evidence that people have a problem and may adopt a solution. Interviews, small pilots and honest tests beat assumptions."),
("business-offer-design","How to Design a Clear Business Offer","Business Strategy","A clear offer describes the audience, outcome, scope, process, price logic and next step. Specificity reduces confusion for buyers and delivery teams."),
("customer-research-questions","Customer Research Questions That Reveal Real Needs","Research","Good research asks about recent behaviour, workarounds and consequences instead of leading people toward a preferred answer."),
("marketing-metrics-that-matter","Marketing Metrics Beyond Likes","Analytics","Metrics should connect activity to a decision. Engagement is a signal; qualified demand, conversion, retention and revenue explain more of the business picture."),
("marketing-dashboard-design","How to Build a Useful Marketing Dashboard","Analytics","A useful dashboard answers recurring business questions. Define the audience, metric, source of truth and decision attached to each chart."),
("customer-retention-strategy","Practical Ways to Improve Customer Retention","Growth Marketing","Retention starts with delivering the promised value and understanding why customers return or leave. Onboarding, support and feedback reveal improvements."),
("growth-experiment-design","How to Design a Growth Experiment","Growth Marketing","A good experiment has a hypothesis, measurable outcome, defined audience and decision rule. Record the result so future tests can improve."),
("digital-marketing-career-roadmap","A Realistic Digital Marketing Career Roadmap","Career Development","Marketing careers grow through fundamentals, focused practice, proof of work and communication. Certificates cannot replace evidence of problem-solving."),
("build-marketing-portfolio","Build a Marketing Portfolio With No Clients","Career Development","Beginners can show clearly labelled practice projects, audits and mock campaigns. Be honest about which work was simulated and which was real."),
("freelance-marketing-first-client","How to Find Your First Freelance Marketing Client","Freelancing","A first client often comes from a specific offer and thoughtful outreach. Show you understand one business problem and suggest a useful next step."),
("marketing-budget-planning","How to Plan a Marketing Budget","Business Strategy","A budget should reflect goals, margins, sales capacity and the cost of learning. Start with a test plan and review cadence rather than copying a competitor."),
("marketing-for-local-business","Marketing Strategy for Local Businesses","Business Strategy","Local marketing works when the offer, discovery, customer experience and follow-up reinforce each other. Choose channels based on customer behaviour."),
("crow-marketing-framework","Crow Marketing: A People-First Growth Framework","Crow Marketing","Crow Marketing is a framework Murder Crow Labs is developing: observe people, understand the business, create with intent, connect channels and learn from evidence. It is not presented as an established industry standard.")
]
PERSONAL=[
("subash-rajendran-performance-marketing","Subash Rajendran on Performance Marketing","Performance Marketing","Subash Rajendran approaches performance marketing as a connected system: audience insight, offer, creative, landing page, measurement and follow-up. A campaign cannot be judged by one platform metric alone.","The practical lesson is to optimise for business outcomes, not only cheap leads. Review lead quality, response time and what happens after the click."),
("subash-rajendran-creative-artist","Subash Rajendran: The Creative Artist Behind Murder Crow Labs","Creative Artistry","Subash Rajendran connects visual expression with business purpose. Brand identity, design and content should feel distinctive while helping people understand the offer.","Creative work is not decoration added at the end. It can clarify an idea, make a product recognisable and turn a complex offer into a message people remember."),
("subash-rajendran-branding-head","Subash Rajendran on Brand Development and Strategy","Brand Strategy","Subash Rajendran treats brand development as more than a logo. Positioning, identity, packaging, customer experience and communication need to tell a coherent story.","Start with the business: audience, offer, alternatives and ambition. Design decisions become more focused once those choices are understood."),
("subash-rajendran-proud-failure","Subash Rajendran: A Proud Failure Who Keeps Building","Founder Journey","Subash Rajendran describes himself as a proud failure: someone who has faced setbacks but continues to learn, rebuild and work toward something better. The point is not to romanticise failure, but to be honest about what it can teach.","A setback is not proof that a person has no future. It can reveal gaps and teach patience. Progress still requires action, accountability and support."),
("subash-rajendran-founder-murder-crow-labs","Why Subash Rajendran Built Murder Crow Labs","Entrepreneurship","Murder Crow Labs reflects Subash Rajendran's ambition to connect creative work, technology and business growth, while making practical learning more accessible.","The long-term vision includes learning opportunities for underprivileged people, struggling creatives and young people, alongside mental-health awareness and the reminder that a person is not limited to one path."),
("subash-rajendran-ai-lead-intelligence","Subash Rajendran on AI Software and Lead Intelligence","AI and Lead Intelligence","Subash Rajendran is exploring how AI software and Lead Intelligence can help businesses organise information, understand customer signals and improve follow-up decisions.","Define the decision to improve before building. Data quality, consent, transparency and human review matter as much as the model or interface."),
("subash-rajendran-crow-marketing","Crow Marketing: The Concept Subash Rajendran Is Developing","Crow Marketing","Crow Marketing is a concept being developed by Subash Rajendran and Murder Crow Labs. It connects observation, business understanding, creative execution, connected channels and evidence-led learning.","The framework will evolve through practice. Its value should be demonstrated through useful examples and honest reporting, not claims that it is already a recognised industry standard.")
]
def e(s): return html.escape(s,quote=True)
def render_article(slug,title,cat,intro,detail,personal=False):
    author="Subash Rajendran" if personal else "Murder Crow Labs"
    author_url=BASE+"/subash-rajendran.html" if personal else BASE+"/about.html"
    url=BASE+"/blog/"+slug+".html"
    checklist=["Define the audience and outcome before choosing a tactic.","Write down the assumption you want to test and what evidence would change your mind.","Choose one measurable action, record the result and improve the next step."]
    if "AI" in cat or "Lead" in cat: checklist=["Use only data you are permitted to process.","Make inputs and recommendations understandable.","Keep human review for important decisions."]
    if "SEO" in cat or "Content" in cat: checklist=["Match one clear reader question and search intent.","Use descriptive headings, useful internal links and accurate author details.","Check accessibility, mobile usability and whether the page genuinely helps."]
    return f'''<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)} | Murder Crow Labs</title><meta name="description" content="{e(intro[:155])}"><meta name="author" content="{author}"><link rel="canonical" href="{url}"><meta name="robots" content="index,follow"><meta property="og:type" content="article"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(intro[:180])}"><meta property="og:url" content="{url}"><meta name="twitter:card" content="summary"><link rel="stylesheet" href="/menu.css"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>:root{{--paper:#f7f5ee;--white:#fffefa;--ink:#11120f;--muted:#686c63;--olive:#68772b;--lime:#d8e92d;--line:#d8d7ce}}*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font:16px/1.75 Arial,sans-serif}}.wrap{{width:min(900px,calc(100% - 34px));margin:auto}}.top{{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);z-index:10}}.nav{{height:72px;display:flex;align-items:center;justify-content:space-between}}.brand{{font-weight:900;text-decoration:none}}.brand span{{color:var(--olive)}}.pill{{padding:10px 16px;border-radius:999px;background:var(--ink);color:#fff;text-decoration:none;font-weight:800;font-size:13px}}.head{{padding:64px 0 30px}}.k{{font:700 10px monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--olive)}}h1{{font-size:clamp(40px,7vw,74px);line-height:.98;letter-spacing:-.06em;margin:18px 0}}.intro{{font-size:20px;color:var(--muted);max-width:760px}}.byline{{font-size:13px;color:var(--muted);margin-top:20px}}.content{{background:var(--white);border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,52px);margin-bottom:55px}}h2{{font-size:clamp(25px,4vw,36px);line-height:1.1;letter-spacing:-.04em;margin:32px 0 12px}}p,li{{color:#34372f}}li{{margin:8px 0}}.callout{{background:#f0f1df;border-left:4px solid var(--olive);padding:18px 20px;border-radius:0 14px 14px 0;margin:24px 0}}footer{{padding:28px 0 48px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}}</style><script type="application/ld+json">{{"@context":"https://schema.org","@type":"Article","headline":{json.dumps(title)},"description":{json.dumps(intro[:180])},"mainEntityOfPage":{json.dumps(url)},"author":{{"@type":{json.dumps("Person" if personal else "Organization")},"name":{json.dumps(author)},"url":{json.dumps(author_url)}}},"publisher":{{"@type":"Organization","name":"Murder Crow Labs","url":"{BASE}/"}}}}</script></head><body><header class="top"><div class="wrap nav"><a class="brand" href="/">Murder <span>Crow</span> Labs</a><a class="pill" href="/#ask-crow">Consult Now →</a></div></header><main class="wrap"><header class="head"><div class="k">{e(cat)} · MURDER CROW LEARN</div><h1>{e(title)}</h1><p class="intro">{e(intro)}</p><div class="byline">By <a href="{author_url}">{author}</a> · Murder Crow Labs</div></header><article class="content"><h2>Start with the real problem</h2><p>{e(intro)}</p><p>{e(detail)}</p><div class="callout"><strong>Practical principle:</strong> choose a useful outcome, make the next step clear and learn from evidence instead of assuming activity equals progress.</div><h2>A practical approach</h2><p>Write down the current situation and what a better result would look like. Identify the people affected, the constraints you cannot ignore and the information you still need. This keeps the work from becoming a collection of disconnected tactics.</p><p>Choose one manageable action. Make the owner, timeline and success measure clear. If the result is weaker than expected, investigate the message, process, experience and assumptions before simply increasing effort or spending.</p><ul>{''.join('<li>'+e(x)+'</li>' for x in checklist)}</ul><h2>Mistakes to avoid</h2><p>Do not copy another business without understanding its audience and constraints. Avoid changing many variables at once, measuring only the easiest number or treating a tool as a substitute for judgement. Be transparent about uncertainty and keep customer trust at the centre of the work.</p><h2>What to do next</h2><p>Turn this guide into a small experiment. Document the starting point, make one thoughtful change and review what happened. A repeatable learning habit is more useful than a complicated plan that never reaches execution.</p><hr><p><strong>About Murder Crow Labs</strong></p><p>Murder Crow Labs connects creativity, technology and business growth. Explore <a href="/services/">our services</a>, browse the <a href="/blog/">learning library</a>, or <a href="/subash-rajendran.html">meet Subash Rajendran</a>.</p></article></main><footer><div class="wrap">Murder Crow Labs · <a href="/">Home</a> · <a href="/about.html">About Murder Crow</a> · <a href="/blog/">All articles</a></div></footer><script defer src="/menu.js"></script></body></html>'''
def card(slug,title,cat,intro,personal=False):
    return f'<article class="card"><div class="cat">{e("Subash Rajendran" if personal else cat)}</div><h2>{e(title)}</h2><p>{e(intro)}</p><a class="read" href="/blog/{slug}.html">Read the guide →</a></article>'

def main():
    # Site-wide cleanup: the ₹10 reservation is retired; paid products retain their own checkout.
    for p in list(ROOT.rglob("*.html")):
        if any(x.startswith(".") for x in p.parts) or p.name=="subash-rajendran.html": continue
        s=p.read_text(encoding="utf-8"); old=s
        s=s.replace('/#reserve','/#ask-crow').replace('href="/about/"','href="/about.html"')
        s=s.replace('Reserve your seat for ₹10 →','Consult Now →').replace('Reserve Your Seat','Consult Now').replace('Reserve ₹10 →','Consult Now →').replace('Reserve your seat','Consult Now').replace('Register for Free Consultation →','Consult Now →').replace('Register for Free Consultation','Consult Now').replace('reserve your seat for ₹10','consult now').replace('I want to know more about #Labs.','I want to know more about Murder Crow Labs.')
        if p == ROOT/"index.html":
            s=s.replace('<title>Murder Crow Labs | Digital Marketing Course, Online Class & Growth Marketing</title>','<title>Murder Crow Labs | Branding, Creative Studio, AI & Performance Marketing</title>')
            s=s.replace('Murder Crow Labs is a practical digital marketing course and online class covering SEO, AEO, GEO, AI marketing, social media marketing, Meta Ads, Google Ads, analytics, CRM, growth marketing and real-world projects. Learn digital marketing online with practical training from Chennai.','Murder Crow Labs is a creative, technology and growth studio founded by Subash Rajendran, building brands, websites, products, AI software, Lead Intelligence and performance marketing systems.')
            s=s.replace('From the first business idea to brand identity, products, spaces, websites, content, applications and growth systems — Murder Crow #Labs brings the pieces together.','From brand identity and product design to websites, applications, AI software, Lead Intelligence, production and performance marketing, Murder Crow Labs connects the pieces that help businesses grow.')
            s=s.replace('<a href="#murder-crow-learn">About #Labs</a>','<a href="/about.html">About Murder Crow</a>')
            s=s.replace('<nav class="mcl-seo-nav" aria-label="Murder Crow learning navigation"><a href="/about/">About</a><a href="/blog/">Learn</a><a href="/blog/">Blog</a></nav>','<nav class="mcl-seo-nav" aria-label="Murder Crow learning navigation"><a href="/blog/">Learn</a><a href="/blog/">Blog</a><a href="/subash-rajendran.html">Subash Rajendran</a></nav>')
            s=s.replace('  reservation: 10,\n','')
            s=re.sub(r'<div class="countdown" aria-label="Offer countdown">.*?</div>','',s,flags=re.S)
            s=re.sub(r'<script src="https://checkout\.razorpay\.com/v1/checkout\.js"></script>','',s)
            s=re.sub(r'async function startRazorpay\(\).*?(?=// growth phase dropdowns)','',s,flags=re.S)
            if 'id="lead-intelligence-ai"' not in s:
                section='''<section class="section reveal" id="lead-intelligence-ai"><div class="wrap"><div class="section-head"><div><div class="kicker">AI · SOFTWARE · LEAD INTELLIGENCE</div><h2>Build smarter systems.<br><em>Make better decisions.</em></h2></div><p>We explore practical AI software and Lead Intelligence that help teams organise information, understand customer signals and act with more context.</p></div><div class="modules"><article class="module"><div class="num">01 · LEAD INTELLIGENCE</div><h3>Know which lead needs attention.</h3><p>Bring lead context, qualification signals and follow-up workflows into a clearer operating picture.</p></article><article class="module"><div class="num">02 · AI SOFTWARE</div><h3>Make repetitive work lighter.</h3><p>Explore AI workflows for research, summaries, classification and productivity with human review.</p></article><article class="module"><div class="num">03 · CONNECTED SYSTEMS</div><h3>Connect marketing to operations.</h3><p>Combine websites, CRM, automation and analytics to learn from the full customer journey.</p></article></div></div></section>'''
                s=s.replace('<section class="section reveal"><div class="wrap"><div class="section-head"><div><div class="kicker">02 · OUR APPROACH',section+'<section class="section reveal"><div class="wrap"><div class="section-head"><div><div class="kicker">02 · OUR APPROACH',1)
            # Reel-style, clickable video cards. Real videos can be added later to /videos/.
            s=s.replace('.testimonial-media{aspect-ratio:16/10;','.testimonial-media{aspect-ratio:9/16;').replace('.testimonial-feature .testimonial-media{aspect-ratio:16/10;min-height:0}', '.testimonial-feature .testimonial-media{aspect-ratio:9/16;min-height:0}')
            a=s.find('  <div class="testimonial-grid">'); b=s.find('  <div class="testimonial-foot">',a)
            if a!=-1 and b!=-1:
                data=[("founder-story.mp4","FOUNDER STORY","Why we build differently.","A founder’s take on the ideas, people and purpose behind Murder Crow Labs.","founder"),("client-testimonial-01.mp4","CLIENT TESTIMONIAL","In their own words.","Real clients sharing what we worked on and what the experience was like.","client"),("project-partner-01.mp4","PROJECT PARTNER","Built together.","Feedback from founders and teams who partnered with us.","partner")]
                m='<div class="testimonial-slider" aria-label="Video testimonials"><div class="testimonial-track">'
                for i,(f,label,title,desc,kind) in enumerate(data):
                    m+=f'<article class="testimonial-card"><button class="testimonial-media testimonial-media--{kind}" type="button" data-testimonial-video="/videos/{f}" aria-label="Play {label.lower()}"><span class="testimonial-play" aria-hidden="true">▶</span><span class="testimonial-media-label">{label}</span><span class="testimonial-media-count">VIDEO {i+1:02d}</span></button><div class="testimonial-copy"><div class="kicker">VIDEO {i+1:02d}</div><h3>{title}</h3><p>{desc}</p><span class="testimonial-status">Video coming soon</span></div></article>'
                m+='</div><div class="testimonial-controls"><button type="button" id="testimonialPrev" aria-label="Previous testimonial">←</button><div id="testimonialDots" class="testimonial-dots"><button class="active" aria-label="Video 1"></button><button aria-label="Video 2"></button><button aria-label="Video 3"></button></div><button type="button" id="testimonialNext" aria-label="Next testimonial">→</button></div></div>'
                s=s[:a]+m+s[b:]
            if 'id="testimonialVideoModal"' not in s:
                s=s.replace('</footer>','</footer><div id="testimonialVideoModal" class="video-modal" aria-hidden="true"><div class="video-modal-inner" role="dialog" aria-modal="true" aria-label="Testimonial video"><button type="button" class="video-close" aria-label="Close video">×</button><video id="testimonialVideo" controls playsinline preload="metadata"></video><p id="testimonialVideoNotice">Video will be added soon.</p></div></div>',1)
                css='''<style id="mcl-testimonial-slider-css">.testimonial-slider{overflow:hidden}.testimonial-track{display:flex;gap:14px;transition:transform .45s ease}.testimonial-track .testimonial-card{flex:0 0 calc((100% - 28px)/3);min-width:0}.testimonial-track .testimonial-media{width:100%;border:0;cursor:pointer;aspect-ratio:9/16}.testimonial-controls{display:flex;justify-content:center;align-items:center;gap:16px;margin-top:18px}.testimonial-controls>button{width:40px;height:40px;border:1px solid var(--line);border-radius:50%;background:var(--paper2);cursor:pointer}.testimonial-dots{display:flex;gap:8px}.testimonial-dots button{width:8px;height:8px;padding:0;border:0;border-radius:99px;background:#c8c9c0}.testimonial-dots button.active{width:24px;background:var(--olive)}.video-modal{display:none;position:fixed;inset:0;background:#11120fee;z-index:9999;align-items:center;justify-content:center;padding:18px}.video-modal[aria-hidden=false]{display:flex}.video-modal-inner{position:relative;width:min(420px,100%);background:#11120f;border-radius:20px;padding:16px;color:white}.video-modal video{width:100%;max-height:75vh;aspect-ratio:9/16;object-fit:contain;background:#050505}.video-close{display:block;margin-left:auto;border:0;background:transparent;color:white;font-size:30px}.video-modal p{color:#ddd;text-align:center}@media(max-width:900px){.testimonial-track .testimonial-card{flex-basis:calc((100% - 14px)/2)}}@media(max-width:580px){.testimonial-track .testimonial-card{flex-basis:100%}}@media(prefers-reduced-motion:reduce){.testimonial-track{transition:none}}</style>'''
                s=s.replace('</head>',css+'</head>',1)
                js='''<script id="mcl-testimonial-slider-js">(()=>{const t=document.querySelector('.testimonial-track');if(!t)return;const cards=[...t.children],dots=[...document.querySelectorAll('#testimonialDots button')];let i=0,timer;const visible=()=>innerWidth<=580?1:innerWidth<=900?2:3;const draw=()=>{const max=Math.max(0,cards.length-visible());i=Math.min(i,max);t.style.transform='translateX('+(-i*(cards[0].getBoundingClientRect().width+14))+'px)';dots.forEach((d,j)=>d.classList.toggle('active',j===i))};const go=n=>{i=(n+cards.length)%cards.length;draw();restart()};const restart=()=>{clearInterval(timer);timer=setInterval(()=>go(i+1),5000)};document.getElementById('testimonialPrev')?.addEventListener('click',()=>go(i-1));document.getElementById('testimonialNext')?.addEventListener('click',()=>go(i+1));dots.forEach((d,j)=>d.addEventListener('click',()=>go(j)));window.addEventListener('resize',draw);document.querySelector('.testimonial-slider')?.addEventListener('mouseenter',()=>clearInterval(timer));document.querySelector('.testimonial-slider')?.addEventListener('mouseleave',restart);draw();restart();const modal=document.getElementById('testimonialVideoModal'),v=document.getElementById('testimonialVideo'),note=document.getElementById('testimonialVideoNotice');const close=()=>{v.pause();v.removeAttribute('src');v.load();modal.setAttribute('aria-hidden','true');document.body.style.overflow=''};document.querySelectorAll('[data-testimonial-video]').forEach(b=>b.addEventListener('click',()=>{modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';v.hidden=false;note.hidden=false;note.textContent='Add this MP4 file to the /videos/ folder in GitHub to activate playback.';v.src=b.dataset.testimonialVideo;v.onerror=()=>{v.hidden=true};v.onloadeddata=()=>{note.hidden=true;v.play().catch(()=>{})};v.load()}));document.querySelector('.video-close')?.addEventListener('click',close);modal?.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.getAttribute('aria-hidden')==='false')close()})})();</script>'''
                s=s.replace('</body>',js+'</body>',1)
            if 'id="subash-seo-hub"' not in s:
                personal='<section class="section reveal" id="subash-seo-hub"><div class="wrap"><div class="section-head"><div><div class="kicker">FOUNDER · CREATIVE ARTIST · GROWTH</div><h2>Subash Rajendran.<br><em>Creative thinking meets business growth.</em></h2></div><p>Founder of Murder Crow Labs, exploring performance marketing, brand development, creative direction, AI software and Lead Intelligence.</p></div><div class="modules"><article class="module"><h3>Performance marketing</h3><p>Connect audience insight, advertising, landing pages, measurement and follow-up.</p></article><article class="module"><h3>Creative artist</h3><p>Bring brand identity, visual storytelling and product thinking together.</p></article><article class="module"><h3>A proud failure who keeps building</h3><p>Learn from setbacks, keep improving and create more access to skills and opportunity.</p></article></div><p style="margin-top:22px"><a class="btn btn-dark" href="/subash-rajendran.html">Explore the Subash Rajendran profile →</a> <a class="btn btn-light" href="/blog/subash-rajendran-performance-marketing.html">Read founder articles →</a></p></div></section>'
                s=s.replace('<section class="final reveal">',personal+'<section class="final reveal">',1)
        if p.name=="about.html":
            s=s.replace('<title>About Murder Crow Labs | Subash Rajendran, Founder</title>','<title>About Murder Crow Labs | Creative, Technology & Growth Studio</title>')
            s=s.replace('Meet Subash Rajendran, founder of Murder Crow Labs — a practical learning and growth marketing collective focused on digital marketing, AI, creativity, technology and real-world projects.','Murder Crow Labs is a creative, technology and growth studio founded by Subash Rajendran, connecting branding, design, products, digital experiences, AI software and performance marketing.')
            s=s.replace('A murder is a group of crows.<br><em>We became one.</em>','If you know the business,<br><em>I know the design.</em>')
            s=s.replace('Not a company built around a classroom. A collective built around people figuring things out — learning, building, failing, improving and helping the next person rise.','Murder Crow Labs brings business thinking and creative execution together — from brand identity and product design to websites, AI software, growth systems and performance marketing.')
            s=s.replace('We don\'t just teach skills. We build people who can figure things out.','We build brands, products and opportunities that help people move forward.')
            s=s.replace('Murder Crow #Labs brings strategy, creativity, digital marketing, technology, AI and career thinking to the same table — with practical work instead of empty theory.','We connect strategy, branding, graphic and packaging design, digital experiences, production, CRM, applications, AI and marketing around real business needs.')
            s=s.replace('The long-term goal is to create opportunities for students who need the chance most — and eventually help fund education for kids who cannot afford it.','Our vision includes practical learning opportunities for underprivileged people, struggling creatives and young people. We also want to encourage mental-health awareness, reduce stigma around seeking help and remind people they are not limited to one path.')
            s=s.replace('Not the strongest bird. The smartest group.','Crow will emerge one day.')
            s=s.replace('Your next chapter<br>starts with a move.','Let’s build what comes next.')
            s=s.replace('Learn something useful. Build something real. Help someone else when you\'re strong enough.','Start with a free consultation. No ₹10 reservation or payment is required.')
            if 'CROW MARKETING' not in s:
                add='<section class="section"><div class="wrap"><div class="k">05 · CROW MARKETING</div><h2>A connected way to make marketing work.</h2><p class="intro">Crow Marketing is a framework Murder Crow Labs is developing: observe people, understand the business, create with intent, connect channels and learn from evidence. It is a working idea, not a claim that the term is already an industry standard.</p><div class="tags"><span class="tag">Observe</span><span class="tag">Understand</span><span class="tag">Create</span><span class="tag">Connect</span><span class="tag">Learn</span></div></div></section><section class="section"><div class="wrap"><div class="k">06 · WHAT WE ARE BUILDING</div><h2>Creative work, technology and growth — together.</h2><div class="grid"><article class="card"><h3>Lead Intelligence</h3><p>Explore systems that help teams organise lead signals, understand context and prioritise follow-up.</p></article><article class="card lime"><h3>AI software</h3><p>We are exploring practical AI tools that help businesses reduce repetitive work and use information better.</p></article><article class="card wide"><h3>Skills should open doors.</h3><p>We want to create learning opportunities for underprivileged people, struggling creatives and young people. Mental-health awareness matters too: asking for support is not weakness.</p></article></div></div></section>'
                s=s.replace('<section class="final">',add+'<section class="final">',1)
        if p.name=="mission.html":
            s=s.replace("The ₹10 isn't the whole story.<br><em>It's where the journey begins.</em>","Skills should open doors.<br><em>Opportunity should travel.</em>")
        if s!=old:p.write_text(s,encoding="utf-8")

    # Remove duplicate About page; Vercel permanently redirects its old URL.
    dup=ROOT/"about/index.html"
    if dup.exists(): dup.unlink()
    legacy_payment=ROOT/"payment.html"
    if legacy_payment.exists(): legacy_payment.unlink()
    (ROOT/"vercel.json").write_text(json.dumps({"redirects":[{"source":"/about","destination":"/about.html","permanent":True},{"source":"/about/","destination":"/about.html","permanent":True},{"source":"/payment.html","destination":"/#ask-crow","permanent":True}]},indent=2)+"\n",encoding="utf-8")

    # Remove the legacy custom-payment link injected by crow-sound.js.
    p=ROOT/"crow-sound.js"
    if p.exists():
        s=p.read_text(encoding="utf-8")
        s=re.sub(r'// Add one separate custom-payment option to the existing menu\..*?const menuTimer=setInterval\(\(\)=>\{if\(addCustomPayment\(\)\|\|\+\+menuTries>20\)clearInterval\(menuTimer\)\},100\);','',s,flags=re.S)
        s=s.replace('Register for Free Consultation →','Consult Now →').replace('Register for Free Consultation','Consult Now')
        p.write_text(s,encoding="utf-8")
    p=ROOT/"menu.js"
    if p.exists():
        s=p.read_text(encoding="utf-8").replace('href="/about/"','href="/about.html"').replace('Register for Free Consultation →','Consult Now →').replace('Register for Free Consultation','Consult Now')
        if "mcl-global-social" not in s:
            s+="""
/* Official social URLs will be connected once supplied; placeholders stay disabled meanwhile. */
(()=>{const add=()=>{const f=document.querySelector('footer');if(!f||f.querySelector('.mcl-global-social'))return;const box=document.createElement('div');box.className='mcl-global-social';box.setAttribute('aria-label','Murder Crow Labs social profiles');box.innerHTML='<a href="#social-links-coming-soon" aria-disabled="true" title="Instagram link will be connected" aria-label="Instagram">◎</a><a href="#social-links-coming-soon" aria-disabled="true" title="LinkedIn link will be connected" aria-label="LinkedIn">in</a>';f.appendChild(box);const st=document.createElement('style');st.textContent='.mcl-global-social{display:flex;gap:10px;margin-top:18px}.mcl-global-social a{display:grid;place-items:center;width:38px;height:38px;border:1px solid currentColor;border-radius:50%;font-weight:900;text-decoration:none}.mcl-global-social a[aria-disabled=true]{opacity:.65;cursor:default}';document.head.appendChild(st)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add()})();
"""
        p.write_text(s,encoding="utf-8")

    # Remove homepage-only testimonial assets that an earlier filename check could add to nested index pages.
    for p in [ROOT/"blog/index.html", ROOT/"services/index.html"]:
        if p.exists():
            s=p.read_text(encoding="utf-8")
            s=re.sub(r'<style id="mcl-testimonial-slider-css">.*?</style>','',s,flags=re.S)
            s=re.sub(r'<script id="mcl-testimonial-slider-js">.*?</script>','',s,flags=re.S)
            s=re.sub(r'<div id="testimonialVideoModal".*?</div></div>','',s,flags=re.S)
            p.write_text(s,encoding="utf-8")

    # Keep a clear place and exact filenames for the videos the founder will upload later.
    video_dir=ROOT/"videos"
    video_dir.mkdir(exist_ok=True)
    (video_dir/"README.md").write_text("""# Murder Crow Labs video testimonials

Add vertical 9:16 MP4 files here when ready:
- founder-story.mp4
- client-testimonial-01.mp4
- project-partner-01.mp4

The homepage slider uses these exact paths. Until a file is uploaded, its card remains a clearly labelled placeholder. Use real, permissioned testimonials only.
""",encoding="utf-8")

    # Disable the retired ₹10 seat-reservation order while keeping real product/custom payments.
    api=ROOT/"api/create-order.js"
    if api.exists():
        a=api.read_text(encoding="utf-8")
        a=a.replace("  const body = req.body || {};\n  const amount = Number(body.amount);",
                    "  const body = req.body || {};\n  if (body.order_type === 'reserve') return sendJson(res, 400, { error: 'Seat reservations are no longer available. Use the free consultation form instead.' });\n  const amount = Number(body.amount);")
        a=a.replace("const orderType = ['reserve', 'full', 'playbook', 'custom'].includes(body.order_type) ? body.order_type : 'reserve';",
                    "const orderType = ['full', 'playbook', 'custom'].includes(body.order_type) ? body.order_type : 'custom';")
        a=a.replace("const allowedAmounts = { reserve: 1000, playbook: 79900, full: 2699900 };","const allowedAmounts = { playbook: 79900, full: 2699900 };")
        a=a.replace("  if (orderType === 'reserve' && crewSize > 1 && crewMembers.length !== crewSize - 1) {\n    return sendJson(res, 400, { error: 'Please provide the selected crew member details.' });\n  }\n","")
        a=a.replace(": `Murder Crow #Labs seat reservation · ₹10 · crew size ${crewSize}`; ",": 'Murder Crow payment'; ")
        a=a.replace(": 'payment.html';",": 'custom-payment.html';")
        api.write_text(a,encoding="utf-8")

    # Generate 50 distinct topic pages plus seven founder pages.
    d=ROOT/"blog";d.mkdir(exist_ok=True)
    items=[]
    for slug,title,cat,intro in TOPICS:
        detail=f"For {cat.lower()}, the useful starting point is to understand the current situation, the people involved and the result you want to improve. {intro} Avoid copying another organisation's approach without checking whether the same assumptions apply."
        (d/(slug+".html")).write_text(render_article(slug,title,cat,intro,detail),encoding="utf-8")
        items.append((slug,title,cat,intro,False))
    for slug,title,cat,intro,detail in PERSONAL:
        (d/(slug+".html")).write_text(render_article(slug,title,cat,intro,detail,True),encoding="utf-8")
        items.append((slug,title,cat,intro,True))
    p=d/"index.html"
    if p.exists():
        s=p.read_text(encoding="utf-8")
        cards=''.join(f'<article class="card"><div class="cat">{e("Subash Rajendran" if pers else cat)}</div><h2>{e(title)}</h2><p>{e(intro)}</p><a class="read" href="/blog/{slug}.html">Read the guide →</a></article>' for slug,title,cat,intro,pers in items)
        s=re.sub(r'<section class="wrap grid">.*?</section>','<section class="wrap grid">'+cards+'</section>',s,count=1,flags=re.S)
        s=s.replace('<title>Murder Crow Learn — Digital Marketing, Growth Marketing & AI</title>','<title>50+ Marketing, Branding, AI & Crow Marketing Guides | Murder Crow Labs</title>')
        s=s.replace('Simple, practical guides for people searching for digital marketing, social media marketing, growth marketing, SEO, AI tools, automation and marketing careers.','Practical articles on performance marketing, branding, creative strategy, AI software, Lead Intelligence, SEO, Crow Marketing and the founder journey of Subash Rajendran.')
        p.write_text(s,encoding="utf-8")
    # Rebuild sitemap from real static URLs, keeping the founder profile untouched.
    paths=["/","/about.html","/subash-rajendran.html","/mission.html","/blog/","/services/","/services/digital-marketing.html","/services/brand-development.html","/services/crm.html","/services/advertising.html","/services/events.html","/portfolio.html","/support.html","/courses/digital-marketing-course.html","/courses/growth-marketing-course.html","/courses/ui-ux-design.html","/courses/graphic-design.html","/learn/ai-tools.html","/learn/how-to-become-a-growth-marketer.html"]
    paths += ["/blog/"+slug+".html" for slug,_,_,_ in TOPICS]
    paths += ["/blog/"+slug+".html" for slug,_,_,_,_ in PERSONAL]
    xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url in paths: xml+=f'  <url><loc>{BASE}{url}</loc><changefreq>weekly</changefreq><priority>{1.0 if url in ["/","/subash-rajendran.html"] else .8:.1f}</priority></url>\n'
    (ROOT/"sitemap.xml").write_text(xml+"</urlset>\n",encoding="utf-8")
    (ROOT/"llms.txt").write_text(f"""# Murder Crow Labs

Official website: {BASE}/
Founder: Subash Rajendran — {BASE}/subash-rajendran.html
About Murder Crow: {BASE}/about.html

Murder Crow Labs is a creative, technology and growth studio spanning brand development, graphic and packaging design, websites, applications, CRM, AI software, Lead Intelligence, performance marketing, production and growth systems.

Crow Marketing is a developing Murder Crow Labs framework connecting audience observation, business understanding, intentional creative, connected channels and evidence-led learning. It is not represented as an established industry standard.

Learning library: {BASE}/blog/
The library contains 50 practical topic guides and seven founder-focused articles about Subash Rajendran.

Editorial principles: publish useful, original, people-first content; avoid keyword stuffing, fake testimonials, guaranteed rankings and invented customer results. The long-term mission includes widening access to learning, supporting underprivileged people and young creatives, and encouraging mental-health awareness.
""",encoding="utf-8")

if __name__=="__main__": main()
