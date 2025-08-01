import InView from "../dist/inview.js";

let elements = new InView({
	selector: ".col",
	delay: 0,
	precision: "high",
	single: false,
})
	.on("enter", (e) => {
		e.target.classList.add("active");
		e.target.innerText = e.percentage.toFixed(2) + "%";
		e.target.style.opacity = e.percentage.toFixed(1) / 100;
		if (e.percentage.toFixed(1) == 100) {
			e.target.classList.add("full");
		} else {
			e.target.classList.remove("full");
		}
	})
	.on("exit", (e) => {
		e.target.classList.remove("active");
		e.target.innerText = "0%";
		e.target.style.opacity = 0.1;
	});

document.getElementById("pause").addEventListener("click", (e) => {
	if (elements.paused) {
		e.target.innerText = "Pause";
		elements.resume();
	} else {
		e.target.innerText = "Resume";
		elements.pause();
	}
});

document.getElementById("delay").addEventListener("input", (e) => {
	elements.setDelay(parseInt(e.target.value || "0"));
});
