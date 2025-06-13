// script.js

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
  const width = 940;
  const height = 500;

  const projection = d3.geoNaturalEarth1();
  const path = d3.geoPath(projection);

  const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("background-color", "#020220");

  const g = svg.append("g");

  const label = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "24px")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("id", "svg-country-title")
    .text("");

  const countriesData = topojson.feature(world, world.objects.countries).features;
  const selectedCountries = [
    "United States of America", "China", "Russia", "India", "Japan",
    "Brazil", "Australia", "United Kingdom", "France", "Germany", "Greece"
  ];
  const filtered = countriesData.filter(d => selectedCountries.includes(d.properties.name));
  projection.fitSize([width, height], {type: "FeatureCollection", features: filtered});

  g.append("g")
    .attr("fill", "#333")
    .selectAll("path")
    .data(countriesData)
    .join("path")
    .attr("d", path);

  const countries = g.append("g")
    .attr("fill", "#888")
    .attr("cursor", "pointer")
    .selectAll("path")
    .data(filtered)
    .join("path")
    .on("click", clicked)
    .attr("d", path);

  countries.append("title")
    .text(d => d.properties.name);

  g.append("path")
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path(topojson.mesh(world, world.objects.countries, (a, b) => a !== b)));

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", event => {
      g.attr("transform", event.transform);
      g.attr("stroke-width", 1 / event.transform.k);
    });

  svg.call(zoom);
  
  const countryInfo = {
    "United States of America": `
      The U.S. leads with a unified National Cybersecurity Strategy, coordinated by the White House. Key agencies include CISA, which protects critical infrastructure, the NSA for intelligence gathering, and the FBI for cybercrime enforcement. They work closely with state and local governments, private sector, and international partners to maintain defense readiness.
   📍 In 2024, the U.S. Launched a $1.6 billion “Cyber Resilience Program” to shield hospitals, utilities, and municipalities from ransomware threats.
    `,
    "China": `
      China enforces strict control over its digital ecosystem through the CAC (Cyberspace Administration of China), Ministry of Public Security, and State Security. These agencies regulate content, monitor networks, and ensure data sovereignty. They partner with domestic tech firms to enforce AI security protocols.
   📍 In 2023, China mandated that all generative AI tools must undergo cybersecurity and ethical audits before public release. 
    `,
    "Russia": `
      Russia focuses on digital sovereignty, with agencies such as the FSB (Federal Security Service), GosSOPKA, and Minister of Digital Development overseeing national cyber policy. They manage firewalls, surveillance, and incident response within a closed internet structure.
   📍 In 2023, Russia migrated 90% of federal systems to its "sovereign internet", reducing reliance on foreign technologies and reinforcing control over domestic infrastructure.
    `,
    "India": `
      India’s cybersecurity is driven by the Ministry of Electronics & IT, CERT-In, and the National Cyber Coordination Centre. These bodies coordinate threat advisories, vulnerability responses, and resilience-building across government, industry, and academia.
   📍 In 2024, India's government trained over 10,000 professionals via "Cyber Surakshit Bharat 2.0" to secure critical national infrastructure.
    `,
    "Japan": `
      Japan prioritizes national infrastructure protection, especially during major events.
      The NISC (National Center of Incident Readiness and Strategy for Cybersecurity) leads strategy.
      Coordination occurs via the Cybersecurity Strategic Headquarters.
     📍  Japan launched JC‑STAR, an innovative IoT Security Labeling Scheme by METI & IPA. This voluntary multi-tier certification ensures IoT devices meet stringent security standards—ranging from self-declared basic compliance to third-party-verified levels—helping government, businesses, and consumers choose secure products.
    `,
    "Brazil": `
      Brazil enforces the LGPD and enhances cybersecurity through regional CERTs and a national defense strategy targeting key sectors like finance and energy. CGI.br and the army play operational roles in cyber defense. The country invests in regional coordination and cyber drills.
     📍  Brazil introduced an AI‑driven National Cyber Strategy, integrating artificial intelligence for threat detection across public services, critical infrastructure, and digital identity systems—reflecting a strategic leap toward automated, intelligence-led cybersecurity
    `,
    "Australia": `
      Australia applies the CESAR strategy to boost national cyber awareness and rapid response. The ACSC leads coordination across sectors, supported by strong international partnerships and threat intelligence sharing. Public engagement and regulation are key elements.
     📍  In 2023, Australia released its 2023–2030 Cyber Security Strategy, funneling AUD 587 million+ into six “cyber shields” including critical infrastructure uplift, sovereign capabilities, and mandatory incident reporting—transforming cybersecurity from a technical topic into a whole-of-nation effort
    `,
    "United Kingdom": `
      The UK follows the National Cyber Security Strategy led by the NCSC (National Cyber Security Centre). It promotes cyber hygiene through nationwide education initiatives, digital skills development, and public awareness campaigns. Strong partnerships exist with industry and intelligence services such as GCHQ, ensuring rapid response and coordinated defense against major cyber threats. The UK is also a leader in international cybersecurity cooperation, especially through NATO and the Five Eyes alliance.
     📍 In 2024, the UK expanded its Cyber Explorers programme to schools nationwide, engaging over 100,000 students in cybersecurity fundamentals and career pathways.
    `,
    "France": `
      France coordinates its cybersecurity policy through ANSSI (National Cybersecurity Agency of France), which oversees resilience planning, national incident response, and regulatory guidance. CERT-FR is responsible for monitoring cyber incidents, protecting critical infrastructure, and disseminating alerts. Public-private collaboration is a central pillar of France’s strategy, with sectoral CERTs and coordinated risk management across industries. 
     📍 Ιn 2023, ANSSI launched the France Cybersecurity Campus in Paris—a new innovation hub to connect government, industry, and academia on cyber research and training.
    `,
    "Germany": `
      Germany enforces cybersecurity through the BSI (Federal Office for Information Security), which sets national IT security standards and manages public-sector cyber risk. The country runs real-time cyber threat detection, large-scale awareness campaigns, and digital literacy initiatives for SMEs. National coordination is handled via the Cyber-AZ (National Cyber Response Centre), bringing together multiple agencies to respond to emerging threats. Germany also invests in cybersecurity innovation, military cyber capabilities, and AI for digital defense.
     📍 In 2024, Germany adopted the EU NIS2 Directive through its national IT Security Strengthening Act, expanding mandatory cybersecurity obligations to more sectors—including healthcare, energy, finance, and public services.
    `,
    "Greece": `
      Greece leads a coordinated cybersecurity policy across several agencies.
      The National Cybersecurity Authority (under the Ministry of Digital Governance) sets national strategy.
      GR-CERT handles incidents and technical guidance.
      The Cyber Crime Division of the Hellenic Police fights digital fraud and threats.
      The Hellenic Intelligence Service handles high-level cyber risks.
      ENISA, the EU Agency for Cybersecurity, is headquartered in Crete and supports EU-wide policy.
      They coordinate across government, industry, and academia to strengthen defenses.
      📍 In 2023, Greece was ranked as the 5th most cyber-secure country in Europe. In 2025, over 52% of Greek companies increased their cybersecurity budgets during 2024, with only 4.8% reducing investment—a strong sign of growing business awareness and commitment to cyber resilience 
    `
  };

  const infoBox = d3.select("body").append("div")
    .attr("id", "info-box")
    .style("position", "fixed")
    .style("top", "120px")
    .style("left", "40px")
    .style("width", "300px")
    .style("background", "#111")
    .style("color", "white")
    .style("padding", "10px")
    .style("border", "1px solid #444")
    .style("border-radius", "6px")
    .style("display", "block");

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    const countryName = d.properties.name;
    if (event && event.stopPropagation) event.stopPropagation();

    countries.transition().style("fill", d =>
      d.properties.name === countryName ? "red" : "#888"
    );

    label.text(countryName);

    const info = countryInfo[countryName] || "No data available.";
    infoBox.style("display", "block").html(
      `<h3>${countryName}</h3><p style='text-align: justify;'>${info}</p>`
    );

    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
    );
  }

  const dotNav = d3.select("#dot-nav");
  const stepElements = document.querySelectorAll(".step");

  stepElements.forEach((_, i) => {
    dotNav.append("div").attr("class", "dot").attr("data-index", i);
  });

  const dots = document.querySelectorAll(".dot");

  // Click on dot scrolls to corresponding step
  dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    stepElements[i].scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = [...stepElements].indexOf(entry.target);
        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === index);
        });

        const countryName = entry.target.dataset.country;

        if (countryName === "Greece-Intro") {
          d3.select("#country-title").text("Our country on the map...");
          return;
        }

        d3.select("#map").style("display", "block");
        d3.select("#country-title").text(countryName);

        const country = filtered.find(d => d.properties.name === countryName);
        if (country) {
          clicked({ stopPropagation: () => {} }, country);
        }
      }
    });
  }, { threshold: 0.5 });

  stepElements.forEach(step => observer.observe(step));
});

