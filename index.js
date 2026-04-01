document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#projectForm");
  const CardsContainer = document.getElementById("projectCards");

  let projects = getProjects();

  renderProjects();

  // SUBMIT FORM
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newProject = await getFormData();
    projects.push(newProject);

    saveProjects();
    renderProjects();
    form.reset();

    alert("Project added successfully!");
  });

  // EDIT PROJECT
  window.showEdit = (index) => {
    const p = projects[index];

    setValue("editIndex", index);
    setValue("editProjectName", p.projectName);
    setValue("editDescription", p.description);
    setValue("editStartDate", p.startDate);
    setValue("editEndDate", p.endDate);

    setCheckbox("editTech1", p.technologies, "Node.js");
    setCheckbox("editTech2", p.technologies, "React.js");
    setCheckbox("editTech3", p.technologies, "Next.js");
    setCheckbox("editTech4", p.technologies, "TypeScript");

    new bootstrap.Modal("#editModal").show();
  };

  window.saveEdit = async () => {
    const index = getValue("editIndex");
    const file = document.getElementById("editImage").files[0];

    let imageURL = projects[index].imageURL;
    if (file) imageURL = await toBase64(file);

    projects[index] = {
      ...projects[index],
      projectName: getValue("editProjectName"),
      description: getValue("editDescription"),
      startDate: getValue("editStartDate"),
      endDate: getValue("editEndDate"),
      technologies: getTech("edit"),
      imageURL,
    };

    saveProjects();
    renderProjects();

    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    alert("Project updated successfully!");
  };

  // DELETE
  window.deleteCard = (index) => {
    if (!confirm("Yakin mau hapus?")) return;

    projects.splice(index, 1);
    saveProjects();
    renderProjects();

    alert("Project deleted successfully!");
  };

  // DETAIL
  window.showDetail = (index) => {
    const p = projects[index];

    document.getElementById("modalTitle").innerText = p.projectName;
    document.getElementById("modalBody").innerHTML = `
      <img src="${p.imageURL}" class="img-fluid mb-3">
      <p><strong>Description:</strong> ${p.description}</p>
      <p><strong>Start Date:</strong> ${p.startDate}</p>
      <p><strong>End Date:</strong> ${p.endDate}</p>
      <p><strong>Technologies:</strong> ${p.technologies.join(", ")}</p>
    `;

    new bootstrap.Modal("#detailModal").show();
  };

  // RENDER
  function renderProjects(list = projects) {
    CardsContainer.innerHTML = list
      .map(
        (p, i) => `
      <div class="col-md-4">
        <div class="card h-100">
          <img src="${p.imageURL}" class="card-img-top" style="height:220px;object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <h3>${p.projectName}</h3>
            <p>${p.startDate} → ${p.endDate}</p>
            <p>${p.description || "-"}</p>
            <p><strong>Tech:</strong> ${p.technologies.join(", ")}</p>

            <button class="btn btn-info mb-2" onclick="showDetail(${i})">Detail</button>
            <button class="btn btn-warning mb-2" onclick="showEdit(${i})">Edit</button>
            <button class="btn btn-danger" onclick="deleteCard(${i})">Delete</button>
          </div>
        </div>
      </div>`,
      )
      .join("");
  }

  // HELPERS
  function getProjects() {
    return JSON.parse(localStorage.getItem("projects")) || [];
  }

  function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  function getValue(id) {
    return document.getElementById(id).value;
  }

  function setValue(id, value) {
    document.getElementById(id).value = value;
  }

  function setCheckbox(id, list, value) {
    document.getElementById(id).checked = list.includes(value);
  }

  function getTech(prefix = "") {
    const tech = [];
    if (document.getElementById(`${prefix}Tech1`).checked) tech.push("Node.js");
    if (document.getElementById(`${prefix}Tech2`).checked)
      tech.push("React.js");
    if (document.getElementById(`${prefix}Tech3`).checked) tech.push("Next.js");
    if (document.getElementById(`${prefix}Tech4`).checked)
      tech.push("TypeScript");
    return tech;
  }

  async function getFormData() {
    const file = document.getElementById("formFile").files[0];

    return {
      projectName: getValue("Projectname").trim(),
      description: getValue("Description").trim(),
      startDate: getValue("startDate"),
      endDate: getValue("endDate"),
      technologies: getTech(),
      imageURL: file ? await toBase64(file) : "",
    };
  }

  function toBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
});
