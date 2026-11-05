(() => {
  const projects = window.portfolioProjects || [];
  const currentLanguage = () => document.documentElement.lang === "en" ? 1 : 0;
  const text = value => Array.isArray(value) ? value[currentLanguage()] : value;

  function translatedElement(tag, values, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.dataset.fr = Array.isArray(values) ? values[0] : values;
    element.dataset.en = Array.isArray(values) ? values[1] : values;
    element.textContent = text(values);
    return element;
  }

  document.querySelectorAll("[data-project-category]").forEach(grid => {
    const category = grid.dataset.projectCategory;
    projects.filter(project => project.category === category).forEach(project => {
      const card = document.createElement(project.videoDownload ? "article" : "a");
      card.className = "project-gallery-card interactive-hover";
      if (!project.videoDownload) {
        card.href = `projet.html?projet=${encodeURIComponent(project.id)}`;
      }

      const image = document.createElement("img");
      image.src = project.image;
      image.alt = text(project.title);
      if (project.videoDownload) {
        const posterLink = document.createElement("a");
        posterLink.className = "project-video-poster-link";
        posterLink.href = project.videoDownload;
        posterLink.download = "";
        posterLink.setAttribute("aria-label", text([
          `Télécharger la vidéo « ${text(project.title)} »`,
          `Download the “${text(project.title)}” video`
        ]));
        posterLink.append(image);
        card.append(posterLink);
      } else {
        card.append(image);
      }
      card.append(translatedElement("h2", project.title), translatedElement("p", project.summary));
      if (project.videoDownload) {
        const details = translatedElement("a", ["Voir le projet →", "Explore the project →"], "project-open");
        details.href = `projet.html?projet=${encodeURIComponent(project.id)}`;
        const download = translatedElement("a", ["Télécharger la vidéo ↗", "Download video ↗"], "project-download-link");
        download.href = project.videoDownload;
        download.download = "";
        card.append(details, download);
      } else {
        card.append(translatedElement("span", ["Voir le processus →", "Explore the process →"], "project-open"));
      }
      grid.append(card);
    });
  });

  const content = document.getElementById("projectContent");
  if (!content) return;

  const projectId = new URLSearchParams(window.location.search).get("projet");
  const project = projects.find(item => item.id === projectId);

  if (!project) {
    document.title = "Projet introuvable — Portfolio";
    content.append(
      translatedElement("h1", ["Projet introuvable", "Project not found"], "page-title"),
      translatedElement("p", ["Ce projet n’existe pas ou n’est plus disponible.", "This project does not exist or is no longer available."])
    );
    return;
  }

  const updateDocumentTitle = () => {
    document.title = currentLanguage()
      ? `${text(project.title)} — Timothée Kibundu Mwela Portfolio`
      : `${text(project.title)} — Portfolio de Timothée Kibundu Mwela`;
  };
  updateDocumentTitle();
  document.addEventListener("portfolio-language-change", updateDocumentTitle);
  const categoryPage = { web: "sites.html", identity: "affiches.html", video: "videos.html" }[project.category];
  const back = translatedElement("a", ["← Retour aux projets", "← Back to projects"], "back-btn");
  back.href = categoryPage;
  const title = translatedElement("h1", project.title, "page-title");
  const summary = translatedElement("p", project.summary, "page-subtitle");
  const metadata = translatedElement("p", `${text(project.projectKind)} · ${text(project.role)} · ${text(project.year)}`, "project-meta");

  const hero = document.createElement("div");
  hero.className = "project-detail-hero";
  const heroMedia = document.createElement("div");
  heroMedia.className = "project-hero-media";
  if (project.videoDownload) {
    const posterLink = document.createElement("a");
    posterLink.href = project.videoDownload;
    posterLink.download = "";
    posterLink.setAttribute("aria-label", text([
      `Télécharger la vidéo « ${text(project.title)} »`,
      `Download the “${text(project.title)}” video`
    ]));
    const poster = document.createElement("img");
    poster.src = project.image;
    poster.alt = text(["Télécharger la vidéo du projet", "Download the project video"]);
    posterLink.append(poster);
    heroMedia.append(posterLink);
  } else {
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = text(project.title);
    heroMedia.append(image);
  }
  const intro = document.createElement("div");
  intro.append(
    translatedElement("p", ["Le brief", "The brief"], "section-index"),
    translatedElement("p", project.brief),
    translatedElement("p", ["Le projet", "The project"], "section-index"),
    translatedElement("p", project.overview)
  );
  if (project.videoDownload) {
    const download = translatedElement("a", ["Télécharger la vidéo ↗", "Download video ↗"], "project-download-link");
    download.href = project.videoDownload;
    download.download = "";
    intro.append(
      download,
      translatedElement("p", [
        "Après le téléchargement, ouvrez le fichier avec le lecteur vidéo de votre choix.",
        "After downloading, open the file in your preferred video player."
      ], "project-download-hint")
    );
  }
  hero.append(heroMedia, intro);

  const process = document.createElement("div");
  process.className = "project-process";
  project.stages.forEach((stage, index) => {
    const card = document.createElement("article");
    card.append(
      translatedElement("span", `0${index + 1}`),
      translatedElement("h2", stage[0]),
      translatedElement("p", stage[1])
    );
    process.append(card);
  });

  const projectElements = [];
  if (project.category !== "video") {
    const gallery = document.createElement("div");
    gallery.className = "project-gallery-strip";
    gallery.setAttribute("role", "group");
    gallery.setAttribute("aria-label", text(["Visuels du projet — sélectionner pour agrandir", "Project visuals — select to enlarge"]));
    const projectImages = project.gallery || [project.image];
    projectImages.forEach((source, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-gallery-image";
    button.setAttribute("aria-label", text([
      `Afficher le visuel ${index + 1} dans la présentation du projet`,
      `Show visual ${index + 1} in the project presentation`
    ]));
    button.setAttribute("aria-pressed", String(!project.videoDownload && source === project.image));

    const image = document.createElement("img");
    image.src = source;
    image.alt = `${text(project.title)} — ${currentLanguage() ? "visual" : "visuel"} ${index + 1}`;
    image.loading = "lazy";
    button.append(image);
    button.addEventListener("click", () => {
      const selectedImage = document.createElement("img");
      selectedImage.src = source;
      selectedImage.alt = image.alt;
      selectedImage.dataset.selectedProjectImage = "";
      heroMedia.replaceChildren(selectedImage);
      gallery.querySelectorAll(".project-gallery-image").forEach(item => {
        item.setAttribute("aria-pressed", String(item === button));
      });
    });
    gallery.append(button);
    });

    projectElements.push(
      translatedElement("h2", ["Visuels du projet", "Project visuals"], "section-index"),
      translatedElement("p", ["Sélectionner un visuel pour l’afficher en grand.", "Select a visual to display it above."], "project-gallery-hint"),
      gallery
    );
  }

  const details = document.createElement("p");
  details.className = "project-meta";
  details.textContent = `${text(project.projectKind)} · ${text(project.role)} · ${text(project.tools)}`;

  content.append(
    back,
    title,
    summary,
    metadata,
    hero,
    translatedElement("h2", ["Processus créatif", "Creative process"], "section-index"),
    process,
    ...projectElements,
    details
  );

  if (project.repo || project.booklet) {
    const resources = document.createElement("div");
    resources.className = "project-navigation";
    if (project.repo) {
      const repository = translatedElement("a", ["Consulter le projet GitHub ↗", "View the GitHub project ↗"]);
      repository.href = project.repo;
      repository.target = "_blank";
      repository.rel = "noreferrer";
      resources.append(repository);
    }
    if (project.booklet) {
      const booklet = translatedElement("a", ["Télécharger le livret d’accueil MMI (PDF)", "Download the MMI welcome booklet (PDF)"]);
      booklet.href = project.booklet;
      booklet.download = "";
      resources.append(booklet);
    }
    content.append(resources);
  }
})();
