console.log("instant nav works !");

const links = document.querySelectorAll("a");

[...links].forEach((link) => {
  link.onclick = (e) => {
    e.preventDefault();
    fetch(link.href)
      .then((response) => response.text())
      .then((res) => {
        const parser = new DOMParser();
        const document = parser.parseFromString(res, "text/html");
        console.log(document);
      });
  };
});
