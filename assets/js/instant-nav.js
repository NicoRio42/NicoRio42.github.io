console.log("instant nav works !");

const links = document.querySelectorAll("a");

[...links].forEach((link) => {
  link.onclick = (e) => {
    e.preventDefault();
    fetch(link.href)
      .then((response) => response.text())
      .then((res) => {
        const parser = new DOMParser();
        const linkDoc = parser.parseFromString(res, "text/html");
        const main = document.getElementById("main");
        main.innerHTML = linkDoc.getElementById("main").innerHTML;
      });
  };
});
