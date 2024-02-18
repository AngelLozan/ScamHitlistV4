const Flash = (message: string, type: string) => {
  const flashElement = document.createElement("div");
  flashElement.className = `alert alert-${type} alert-dismissible fade show m-3 position-fixed top-0 end-0`;
  flashElement.role = "alert";
  flashElement.textContent = `${message}`;

  const button = document.createElement("button");
  button.className = "btn-close";
  button.setAttribute("data-bs-dismiss", "alert");

  button.addEventListener("click", () => {
    flashElement.remove();
  });

  flashElement.appendChild(button);
  document.body.appendChild(flashElement);

  setTimeout(() => {
    flashElement.remove();
  }, 5000);
}

export default Flash;
