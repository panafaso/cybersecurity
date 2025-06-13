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

 // const label = svg.append("text")
  //  .attr("x", width / 2)
  //  .attr("y", 40)
  //  .attr("text-anchor", "middle")
  //  .attr("fill", "white")
  //  .attr("font-size", "24px")
 //   .attr("font-family", "sans-serif")
 //   .attr("font-weight", "bold")
 //   .attr("id", "svg-country-title")
//.text("");

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
      The U.S. leads with a unified National Cybersecurity Strategy, coordinated by the White House. Key agencies like CISA, NSA, and the FBI protect infrastructure, gather intelligence, and fight cybercrime in close cooperation with states and the private sector.
    📍 In 2024, the U.S. launched a $1.6 billion Cyber Resilience Program to protect hospitals, utilities, and municipalities from escalating ransomware threats.`,
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
    📍 In 2025, Japan launched JC‑STAR, a multi-level IoT security labeling scheme to help users identify and choose secure devices.
    `,
    "Brazil": `
      Brazil enforces the LGPD and enhances cybersecurity through regional CERTs and a national strategy focused on key sectors like finance and energy. CGI.br and the army support operational defense and regional coordination.
    📍 In 2025, Brazil introduced an AI-driven cyber strategy, using artificial intelligence to protect public services and critical infrastructure.
    `,
    "Australia": `
      Australia applies the CESAR strategy to strengthen cyber awareness and response. The ACSC leads coordination, backed by global partnerships and strong regulation.
    📍 In 2023, Australia launched its Cyber Security Strategy 2023–2030, investing AUD 587 million to protect critical infrastructure and enforce incident reporting.
    `,
    "United Kingdom": `
      The UK follows the National Cyber Security Strategy led by the NCSC, promoting cyber hygiene through education and public awareness. It works closely with industry, GCHQ, and international allies like NATO and Five Eyes.
    📍 In 2024, the UK expanded Cyber Explorers to schools nationwide, reaching over 100,000 students with cybersecurity education.
    `,
    "France": `
      France coordinates cybersecurity through ANSSI, with CERT-FR monitoring threats and protecting critical infrastructure. Public-private cooperation and sectoral CERTs are key to its strategy.
    📍 In 2023, ANSSI launched the France Cybersecurity Campus in Paris to foster innovation and collaboration in cyber research and training.
    `,
    "Germany": `
      Germany enforces cybersecurity through the BSI, with real-time threat detection, awareness campaigns, and coordination via the Cyber-AZ. It invests in innovation, cyber defense, and AI.
    📍 In 2024, Germany adopted the EU NIS2 Directive, expanding cybersecurity rules to key sectors like healthcare, energy, and finance.
    `,
    "Greece": `
      Greece leads a coordinated cybersecurity policy across several agencies.
      The National Cybersecurity Authority (under the Ministry of Digital Governance) sets national strategy.
      GR-CERT handles incidents and technical guidance.
      The Cyber Crime Division of the Hellenic Police fights digital fraud and threats.
      The Hellenic Intelligence Service handles high-level cyber risks.
      ENISA, the EU Agency for Cybersecurity, has its official offices in Athens and Crete, and supports EU-wide policy.
    📍 In 2023, Greece was ranked as the 5th most cyber-secure country in Europe. By 2025, over 52% of Greek companies increased their cybersecurity budgets during 2024.
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

    //label.text(countryName);

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

        if (countryName === "Intro") {
  d3.select("#map").style("display", "none");
  d3.select("#country-title").text("");
  infoBox.style("display", "none");
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

