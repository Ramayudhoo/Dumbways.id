document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#projectForm");
  const CardsContainer = document.getElementById("projectCards");

  let projects = JSON.parse(localStorage.getItem("projects")) || [];

  renderProjects();

  // SUBMIT FORM
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const projectName = document.getElementById("Projectname").value.trim();
    const description = document.getElementById("Description").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const img = document.getElementById("formFile").files[0];

    // Ambil checkbox untuk project baru
    const technologies = [];
    if (document.getElementById("tech1").checked) technologies.push("Node.js");
    if (document.getElementById("tech2").checked) technologies.push("React.js");
    if (document.getElementById("tech3").checked) technologies.push("Next.js");
    if (document.getElementById("tech4").checked)
      technologies.push("TypeScript");

    // Convert image ke Base64
    let imageBase64 = "";
    if (img) imageBase64 = await toBase64(img);

    const projectData = {
      projectName,
      description,
      startDate,
      endDate,
      technologies,
      imageURL: imageBase64,
    };

    projects.push(projectData);
    saveToLocal();
    renderProjects();
    form.reset();

    // Notifikasi sukses
    alert("Project added successfully!");
  });

  // EDIT PROJECT
  window.showEdit = function (index) {
    const project = projects[index];

    document.getElementById("editIndex").value = index;
    document.getElementById("editProjectName").value = project.projectName;
    document.getElementById("editDescription").value = project.description;
    document.getElementById("editStartDate").value = project.startDate;
    document.getElementById("editEndDate").value = project.endDate;

    // Set checkbox teknologi
    document.getElementById("editTech1").checked =
      project.technologies.includes("Node.js");
    document.getElementById("editTech2").checked =
      project.technologies.includes("React.js");
    document.getElementById("editTech3").checked =
      project.technologies.includes("Next.js");
    document.getElementById("editTech4").checked =
      project.technologies.includes("TypeScript");

    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
  };
  window.editProject = window.showEdit;

  window.saveEdit = async function () {
    const index = document.getElementById("editIndex").value;
    const fileInput = document.getElementById("editImage").files[0];

    let updatedImg = projects[index].imageURL;

    // Jika user upload gambar baru → convert base64
    if (fileInput) {
      updatedImg = await toBase64(fileInput);
    }

    const updatedTech = [];
    if (document.getElementById("editTech1").checked)
      updatedTech.push("Node.js");
    if (document.getElementById("editTech2").checked)
      updatedTech.push("React.js");
    if (document.getElementById("editTech3").checked)
      updatedTech.push("Next.js");
    if (document.getElementById("editTech4").checked)
      updatedTech.push("TypeScript");

    // Update data
    projects[index] = {
      ...projects[index],
      projectName: document.getElementById("editProjectName").value,
      description: document.getElementById("editDescription").value,
      startDate: document.getElementById("editStartDate").value,
      endDate: document.getElementById("editEndDate").value,
      technologies: updatedTech,
      imageURL: updatedImg,
    };

    saveToLocal();
    renderProjects();

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("editModal"),
    );
    modal.hide();

    //notifikasi sukses
    alert("Project updated successfully!");
  };

  // Convert file → base64
  function toBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  function saveToLocal() {
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  // RENDER PROJECT Menggunakan .map
  function renderProjects(list = projects) {
    CardsContainer.innerHTML = list
      .map((p, index) => {
        return `
      <div class="col-md-4">
        <div class="contact-card card h-100">
          <img src="${
            p.imageURL
          }" class="card-img-top" style="height:220px;object-fit:cover;">
          <div class="profile-info card-body d-flex flex-column">
            <h3>${p.projectName}</h3>
            <p >${p.startDate} → ${p.endDate}</p>
           <p >${p.description}</p>
            <p><strong>Tech:</strong> ${p.technologies.join(", ")}</p>

            <button class="btn btn-info mb-2" onclick="showDetail(${index})">
              Detail
            </button>

            <button class="btn btn-warning mb-2" onclick="editProject(${index})">
              Edit
            </button>

            <button class="btn btn-danger" onclick="deleteCard(${index})">
              Delete
            </button>
          </div>
        </div>
      </div>`;
      })
      .join("");
  }

  window.deleteCard = function (index) {
    projects.splice(index, 1);
    saveToLocal();
    renderProjects();
    //notifikasi sukses
    alert("Project deleted successfully!");
  };

  // SHOW DETAIL MODAL
  window.showDetail = function (index) {
    const project = projects[index];
    document.getElementById("modalTitle").innerText = project.projectName;
    document.getElementById("modalBody").innerHTML = `
      <img src="${
        project.imageURL
      }" class="img-fluid mb-3" style="object-fit:cover;">
      <p><strong>Description:</strong> ${project.description}</p>
      <p><strong>Start Date:</strong> ${project.startDate}</p>
      <p><strong>End Date:</strong> ${project.endDate}</p>
      <p><strong>Technologies:</strong> ${project.technologies.join(", ")}</p>
    `;
    const myModal = new bootstrap.Modal(document.getElementById("detailModal"));
    myModal.show();
  };
});
