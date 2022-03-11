console.log("instant nav works !");

function scanLinks() {
  const links = document.querySelectorAll("a");

  [...links].forEach((link) => {
    if (document.location.origin === link.origin) {
      link.onclick = (e) => {
        e.preventDefault();
        fetch(link.href)
          .then((response) => response.text())
          .then((res) => {
            const parser = new DOMParser();
            const linkDoc = parser.parseFromString(res, "text/html");
            const main = document.getElementById("main");
            main.innerHTML = linkDoc.getElementById("main").innerHTML;
            window.scrollTo(0, 0);
            history.pushState({link: link.href}, "", link.pathname);
            scanLinks();
          });
      };
    }
  });
}

window.addEventListener('popstate', (event) => {
  console.log(event.state.link);
});

scanLinks();
