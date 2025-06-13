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
    "Australia", "India", "United Kingdom", "China", "United States of America"
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
  "France": `
    France enforces a national cybersecurity strategy through ANSSI.
    It focuses on critical infrastructure protection and public-private cooperation.
    Cyber threat monitoring and incident response are coordinated by CERT-FR.
  `,
  "Germany": `
    Germany operates under the BSI (Federal Office for Information Security).
    It runs real-time cyber threat detection and national awareness campaigns.
    The country also coordinates cybersecurity efforts through the National Cyber Response Centre.
  `,
  "United States of America": `
    The U.S. follows the National Cybersecurity Strategy, led by the White House.
    The Cybersecurity and Infrastructure Security Agency (CISA) handles major cyber defense tasks.
    It also collaborates with the NSA and FBI for threat intelligence and critical incident handling.
  `,
  "Russia": `
    Russia enforces strict internet controls and domestic cybersecurity policies.
    It operates its own cyber police and invests in national firewall technologies.
    The FSB and GosSOPKA are key actors in national cybersecurity defense.
  `,
  "China": `
    China implements the Golden Shield Project and strict content regulation.
    It emphasizes internal surveillance and state-controlled data policies.
    The Cyberspace Administration of China (CAC) leads national cyber operations.
  `,
  "India": `
    India developed a National Cybersecurity Strategy focusing on resilience.
    CERT-In (Computer Emergency Response Team India) handles incident response.
    The country promotes capacity building and cooperation via the National Cyber Coordination Centre.
  `,
  "United Kingdom": `
    The UK leads with the National Cyber Security Strategy under the NCSC.
    It invests in education and public awareness for cyber hygiene.
    The strategy includes partnerships with private sector and intelligence agencies.
  `,
  "Japan": `
    Japan prioritizes infrastructure protection, especially for major events like the Olympics.
    The National center of Incident readiness and Strategy for Cybersecurity (NISC) coordinates national efforts.
    It also promotes public-private collaboration through the Cybersecurity Strategic Headquarters.
  `,
  "Brazil": `
    Brazil focuses on building regional CERTs and enforcing the LGPD data protection law.
    The Brazilian Army and the CGI.br play a role in cyber policy implementation.
    The National Cyber Defense Strategy emphasizes critical sector protection.
  `,
  "Australia": `
    Australia applies its Cyber Enhanced Situational Awareness and Response (CESAR) strategy.
    The Australian Cyber Security Centre (ACSC) leads national efforts and outreach.
    It promotes cooperation with industry and international partners for threat intelligence.
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

  const steps = document.querySelectorAll(".step");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const countryName = entry.target.dataset.country;
        const country = filtered.find(d => d.properties.name === countryName);
        if (country) clicked({ stopPropagation: () => {} }, country);
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(step => observer.observe(step));
});
