import"./hoisted.CWYMbbFt.js";const s=document.getElementById("contact-form"),c=document.getElementById("submit-btn"),u=document.getElementById("form-success"),m=c.querySelector(".btn-label"),p=c.querySelector(".btn-loading"),l={"vitrine-essentiel":`Bonjour,

Je suis intéressé(e) par votre Pack Essentiel (Site vitrine — 499 € HT). Je souhaiterais créer une présence web claire et efficace pour mon activité.

Pourriez-vous me recontacter afin que nous échangions sur mon projet et les prochaines étapes ?

Merci par avance.`,"vitrine-artisan":`Bonjour,

Je suis intéressé(e) par votre Pack Artisan (Site vitrine — 999 € HT). J'aimerais valoriser mes services et réalisations en ligne avec un site bien structuré et optimisé pour le référencement local.

Pourriez-vous me recontacter pour discuter de mon projet ?

Merci par avance.`,"vitrine-signature":`Bonjour,

Je suis intéressé(e) par votre Pack Signature (Site vitrine — 1 999 € HT). Je souhaite une présence web ambitieuse avec blog, pages par prestation et éventuellement prise de rendez-vous en ligne.

Pourriez-vous me recontacter pour étudier mon projet plus en détail ?

Merci par avance.`,"ecommerce-pro":`Bonjour,

Je suis intéressé(e) par votre offre Shop Pro (E-commerce — 999 € HT). Je souhaite vendre mes produits en ligne avec un catalogue de 10 à 30 références et un paiement sécurisé.

Pourriez-vous me recontacter pour échanger sur mon projet ?

Merci par avance.`,"ecommerce-premium":`Bonjour,

Je suis intéressé(e) par votre offre Shop Premium (E-commerce — 1 799 € HT). J'ai besoin d'une boutique en ligne complète avec catalogue étendu, livraison multi-mode et outils de fidélisation.

Pourriez-vous me recontacter pour en discuter ?

Merci par avance.`,"refonte-rafraichissement":`Bonjour,

Je souhaite un rafraîchissement de mon site actuel (offre à 399 € HT). La structure fonctionne mais le design mériterait d'être modernisé.

Pourriez-vous me recontacter pour évaluer mon besoin ?

Merci par avance.`,"refonte-vitrine":`Bonjour,

Je souhaite une refonte complète de mon site vitrine (offre à 699 € HT). Je veux reconstruire l'ensemble avec une nouvelle arborescence et un design moderne, tout en préservant mon référencement.

Pourriez-vous me recontacter pour étudier mon projet ?

Merci par avance.`,"refonte-ecommerce":`Bonjour,

Je souhaite une refonte de ma boutique en ligne (offre à 1 299 € HT) sans perdre l'existant (produits, commandes, SEO).

Pourriez-vous me recontacter pour étudier la migration ?

Merci par avance.`,"seo-plus":`Bonjour,

Je suis intéressé(e) par votre offre SEO Plus (89 € / mois). Je souhaite être visible sur Google auprès d'une clientèle locale.

Pourriez-vous me recontacter pour discuter de mes objectifs ?

Merci par avance.`,"seo-max":`Bonjour,

Je suis intéressé(e) par votre offre SEO Max (179 € / mois). Je souhaite développer durablement ma visibilité sur Google avec un accompagnement complet (articles, optimisations, suivi mensuel).

Pourriez-vous me recontacter ?

Merci par avance.`,vitrine:`Bonjour,

Je souhaite créer un site vitrine pour mon activité. Pourriez-vous me recontacter pour échanger sur mes besoins et le pack le plus adapté ?

Merci par avance.`,ecommerce:`Bonjour,

Je souhaite créer une boutique en ligne. Pourriez-vous me recontacter pour que nous discutions de mon projet et de l'offre la plus adaptée ?

Merci par avance.`,refonte:`Bonjour,

Je souhaite refondre mon site existant. Pourriez-vous me recontacter pour évaluer l'ampleur des travaux nécessaires ?

Merci par avance.`,seo:`Bonjour,

Je souhaite améliorer mon référencement sur Google. Pourriez-vous me recontacter pour me conseiller sur l'offre la plus adaptée ?

Merci par avance.`,maintenance:`Bonjour,

Je souhaite des informations sur votre maintenance technique mensuelle. Pourriez-vous me recontacter ?

Merci par avance.`},d=new URLSearchParams(window.location.search),o=(d.get("service")||"").toLowerCase(),i=(d.get("pack")||"").toLowerCase();if(o){const t=document.getElementById("project-type");if(t){const a=Array.from(t.options).some(n=>n.value===o);t.value=a?o:"autre"}const e=document.getElementById("message");if(e&&!e.value.trim()){const a=i?`${o}-${i}`:o,n=l[a]||l[o];n&&(e.value=n)}const r=document.getElementById("pack");r&&i&&(r.value=i)}s.addEventListener("submit",async t=>{if(t.preventDefault(),!s.checkValidity()){s.reportValidity();return}c.disabled=!0,m.hidden=!0,p.hidden=!1;const e=Object.fromEntries(new FormData(s).entries());if(e.phone&&e.phone.trim()){const r=e.phoneCountry||"+33";e.phone=`${r} ${e.phone.trim()}`}else e.phone="";try{const r={access_key:"b2d398de-9e03-4bc2-a50e-60bc1af2da51",subject:`Nouvelle demande de contact — CapWeb (${e.projectType||"Non précisé"})`,from_name:e.name,email:e.email,phone:e.phone||"—",company:e.company||"—",project_type:e.projectType||"—",message:e.message};if((await(await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json()).success)s.reset(),u.hidden=!1,u.scrollIntoView({behavior:"smooth",block:"nearest"});else throw new Error("server error")}catch{alert("Une erreur est survenue. Merci de réessayer ou de nous contacter directement.")}finally{c.disabled=!1,m.hidden=!1,p.hidden=!0}});
