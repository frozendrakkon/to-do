const initDataTodo = (key) =>
  localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];

const updateDataToDo = (key, toDoData) =>
  localStorage.setItem(key, JSON.stringify(toDoData));

const createToDo = (title, form, list) => {
  const toDoContainer = document.createElement("div");
  const toDoRow = document.createElement("div");
  const toDoHeader = document.createElement("h1");
  const wrapperForm = document.createElement("div");
  const wrapperList = document.createElement("div");

  toDoContainer.classList.add("container");
  toDoRow.classList.add("row");
  toDoHeader.classList.add("text-center", "mb-5", "blog-he");
  wrapperForm.classList.add("col-6");
  wrapperList.classList.add("col-6");

  toDoHeader.textContent = title;

  wrapperForm.append(form);
  wrapperList.append(list);
  toDoRow.append(wrapperForm, wrapperList);
  toDoContainer.append(toDoHeader, toDoRow);
  return toDoContainer;
};

const createFormToDo = () => {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const textArea = document.createElement("textarea");
  const bthSubmit = document.createElement("button");

  input.placeholder = "Заголовок";
  textArea.placeholder = "Описание";

  bthSubmit.textContent = "Добавить";
  bthSubmit.type = "submit";

  form.classList.add("form-group");
  input.classList.add("form-control", "mb-3");
  textArea.classList.add("form-control", "mb-3");
  bthSubmit.classList.add("btn", "btn-primary", "btn-lg", "btn-block");

  form.append(input, textArea, bthSubmit);
  return { input, textArea, bthSubmit, form };
};

const createListToDo = () => {
  const listToDo = document.createElement("ul");
  listToDo.classList.add("list-group");
  return listToDo;
};

const createItemToDo = (item, listToDo) => {
  const itemToDo = document.createElement("li");
  const bthItem = document.createElement("button");

  itemToDo.classList.add("list-group-item", "p-0", "mb-3", "border-0");
  bthItem.classList.add(
    "list-item",
    "btn",
    "btn-block",
    "border-primary",
    "rounded-pill",
    item.success ? "btn-success" : "btn-light"
  );
  bthItem.textContent = item.nameTodo;
  bthItem.id = item.id;

  itemToDo.append(bthItem);
  listToDo.append(itemToDo);
  return itemToDo;
};

const addTodoItem = (key, toDoData, listToDo, nameTodo, descriptionToDo) => {
  const id = `toDo${(+new Date()).toString(16)}`;
  toDoData.push({ id, nameTodo, descriptionToDo, success: false });
  updateToDo(listToDo, toDoData, key);
};

const createModal = () => {
  const modalElem = document.createElement("div");
  const modalDialog = document.createElement("div");
  const modalContent = document.createElement("div");
  const modalHeader = document.createElement("div");
  const modalBody = document.createElement("div");
  const modalFooter = document.createElement("div");
  const itemTitle = document.createElement("h2");
  const itemDescription = document.createElement("p");
  const bthClose = document.createElement("div");
  const bthReady = document.createElement("div");
  const bthDelete = document.createElement("div");

  modalElem.classList.add("modal");
  modalDialog.classList.add("modal-dialog");
  modalContent.classList.add("modal-content");
  modalHeader.classList.add("modal-header");
  modalBody.classList.add("modal-body");
  modalFooter.classList.add("modal-footer");
  itemTitle.classList.add("modal-title");
  bthClose.classList.add("close", "btn-modal");
  bthReady.classList.add("btn", "btn-success", "btn-modal");
  bthDelete.classList.add("btn", "btn-danger", "btn-delete", "btn-modal");

  bthClose.textContent = "x";
  bthReady.textContent = "Выполнено";
  bthDelete.textContent = "Удалить";

  modalDialog.append(modalContent);
  modalContent.append(modalHeader, modalBody, modalFooter);
  modalHeader.append(itemTitle, bthClose);
  modalBody.append(itemDescription);
  modalFooter.append(bthReady, bthDelete);

  modalElem.append(modalDialog);

  const closeModal = (event) => {
    const target = event.target;
    if (target.classList.contains("btn-modal") || target === modalElem) {
      modalElem.classList.remove("d-block");
    }
  };

  const showModal = (titleToDo, descriptionToDo, id) => {
    modalElem.dataset.idItem = id;
    modalElem.classList.add("d-block");
    itemTitle.textContent = titleToDo;
    itemDescription.textContent = descriptionToDo;
  };

  modalElem.addEventListener("click", closeModal);

  return { modalElem, bthReady, bthDelete, showModal };
};
const updateToDo = (listToDo, toDoData, key) => {
  listToDo.textContent = "";
  toDoData.forEach((item) => createItemToDo(item, listToDo));
  updateDataToDo(key, toDoData);
};
const initToDo = (selector) => {
  const key = prompt("Сообщи свой ключ", "");

  const toDoData = initDataTodo(key);

  const wrapper = document.querySelector(selector);
  const formToDo = createFormToDo();
  const listToDo = createListToDo();
  const modal = createModal();
  const toDoApp = createToDo(key, formToDo.form, listToDo);

  document.body.append(modal.modalElem);
  wrapper.append(toDoApp);

  formToDo.form.addEventListener("submit", (event) => {
    event.preventDefault();

    formToDo.input.classList.remove("is-invalid");
    formToDo.textArea.classList.remove("is-invalid");

    if (formToDo.input.value.trim() && formToDo.textArea.value.trim()) {
      // const id = `toDo${(+new Date()).toString(16)}`;
      addTodoItem(
        key,
        toDoData,
        listToDo,
        formToDo.input.value,
        formToDo.textArea.value
      );
      formToDo.form.reset();
    } else {
      if (!formToDo.input.value) {
        formToDo.input.classList.add("is-invalid");
      }
      if (!formToDo.textArea.value) {
        formToDo.textArea.classList.add("is-invalid");
      }
    }
  });

  listToDo.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("list-item")) {
      const item = toDoData.find((elem) => elem.id === target.id);
      modal.showModal(item.nameTodo, item.descriptionToDo, item.id);
    }
  });

  modal.bthReady.addEventListener("click", () => {
    const itemToDo = toDoData.find(
      (elem) => elem.id === modal.modalElem.dataset.idItem
    );

    itemToDo.success = !itemToDo.success;
    updateToDo(listToDo, toDoData);
  });

  modal.bthDelete.addEventListener("click", () => {
    const index = toDoData.findIndex(
      (elem) => elem.id === modal.modalElem.dataset.idItem
    );
    toDoData.splice(index, 1);
    updateToDo(listToDo, toDoData, key);
  });

  document.title = key;

  updateToDo(listToDo, toDoData);
};

initToDo(".app");
