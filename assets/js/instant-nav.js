console.log("instant nav works !");

const links = document.querySelectorAll("a");

[...links].forEach((link) => {
  link.onclick = (e) => {
    e.preventDefault();
    fetch(link.href).then((response) => {
      console.log(response);
    });
  };
});
