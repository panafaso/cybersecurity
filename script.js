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
    .text("");

  const countriesData = topojson.feature(world, world.objects.countries).features;
  const selectedCountries = [
    "Russia", "Germany", "France", "Japan", "Brazil",
    "Australia", "India", "United Kingdom", "China", "United States of America", "Greece"
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
const countryInfo = {
  "United States of America": `
    The U.S. follows the National Cybersecurity Strategy, led by the White House.
    The Cybersecurity and Infrastructure Security Agency (CISA) leads major cyber defense efforts.
    It collaborates with the NSA and FBI on threat intelligence and incident response.
  `,
  "China": `
    China enforces strict content regulation via the Golden Shield Project.
    It emphasizes internal surveillance and data control.
    The Cyberspace Administration of China (CAC) coordinates national cyber efforts.
  `,
  "Russia": `
    Russia operates under domestic cybersecurity laws and strict internet governance.
    The FSB and GosSOPKA oversee cyber defense and threat response.
    National firewalls and cyber policing play a central role.
  `,
  "India": `
    India’s National Cybersecurity Strategy focuses on resilience and infrastructure defense.
    CERT-In leads cyber incident handling and threat advisories.
    The National Cyber Coordination Centre promotes cross-sector cooperation.
  `,
  "Japan": `
    Japan prioritizes national infrastructure protection, especially during major events.
    The NISC (National Center of Incident Readiness and Strategy for Cybersecurity) leads strategy.
    Coordination occurs via the Cybersecurity Strategic Headquarters.
  `,
  "Brazil": `
    Brazil enforces the LGPD and strengthens regional CERTs.
    The National Cyber Defense Strategy focuses on critical sectors.
    The CGI.br and Army play significant cybersecurity roles.
  `,
  "Australia": `
    Australia implements the CESAR strategy for situational awareness and cyber response.
    The ACSC (Australian Cyber Security Centre) leads national coordination.
    International and industry cooperation is a priority.
  `,
  "United Kingdom": `
    The UK follows the National Cyber Security Strategy led by NCSC.
    It promotes cyber hygiene through education and public awareness.
    Strong partnerships exist with industry and intelligence services.
  `,
  "France": `
    France coordinates its cybersecurity policy through ANSSI.
    CERT-FR monitors incidents and critical infrastructure threats.
    Public-private collaboration is a key pillar.
  `,
  "Germany": `
    Germany enforces cybersecurity via the BSI (Federal Office for Information Security).
    The country runs real-time threat detection and awareness campaigns.
    Coordination happens via the National Cyber Response Centre.
  `,
  "Greece": `
    Greece leads a coordinated cybersecurity policy across several agencies.
    The National Cybersecurity Authority (under the Ministry of Digital Governance) sets national strategy.
    GR-CERT handles incidents and technical guidance.
    The Cyber Crime Division of the Hellenic Police fights digital fraud and threats.
    The Hellenic Intelligence Service handles high-level cyber risks.
    ENISA, the EU Agency for Cybersecurity, is headquartered in Crete and supports EU-wide policy.

    📍 Greece was ranked as the 5th most cyber-secure country in Europe in 2023.
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

  // Ακύρωσε παλιά zoom events
  if (event && event.stopPropagation) event.stopPropagation();

  // Βάψε μόνο τη σωστή χώρα κόκκινη
  countries.transition().style("fill", d =>
    d.properties.name === countryName ? "red" : "#888"
  );

  // Ενημέρωσε τίτλο στο SVG
  d3.select("#svg-country-title").text(countryName);

  // Ενημέρωσε info box
  const info = countryInfo[countryName] || "No data available.";
  infoBox.style("display", "block").html(
    `<h3>${countryName}</h3><p>${info}</p>`
  );

  // Zoom 
  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
  );
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const countryName = entry.target.dataset.country;

      // Ειδική μεταχείριση για την εισαγωγική επικεφαλίδα για την Ελλάδα
      if (countryName === "Greece-Intro") {
        d3.select("#country-title").text("Our country on the map...");
        return;
      }

      // Τελική ενότητα: κρύψε τον χάρτη
      if (countryName === "End") {
        d3.select("#map").style("display", "none");
        d3.select("#country-title").text("Credits & Sources");
        infoBox.style("display", "block").html(`
          <h3>Sources</h3>
          <ul>
            <li>ENISA Reports 2023</li>
            <li>National Cybersecurity Strategies</li>
            <li>OECD Digital Security Policy</li>
          </ul>
          <p>Made with ❤️ using D3.js and TopoJSON</p>
        `);
        return;
      }

      // Για κανονικές χώρες (συμπ. Greece)
      d3.select("#map").style("display", "block");
      d3.select("#country-title").text(countryName);

      const country = filtered.find(d => d.properties.name === countryName);
      if (country) {
        clicked({ stopPropagation: () => {} }, country);
      }
    }
  });
}, { threshold: 0.5 });
