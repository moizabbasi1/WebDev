const file = document.querySelector('.container-carousel');
const carouselImg = document.querySelectorAll('.carousel-img');

const BtnLeft = document.getElementById('btn-left');
const BtnRight = document.getElementById('btn-right');

// ? ----- ----- Event Listener for Button Right in carousle. ----- -----
BtnRight.addEventListener('click', () => {
	file.scrollLeft += file.offsetWidth;

	const indicatorActive = document.querySelector('.indicator .active');
	if(indicatorActive.nextSibling){
		indicatorActive.nextSibling.classList.add('active');
		indicatorActive.classList.remove('active');
	}
});

// ? ----- ----- Event Listener for Button left In carousle. ----- -----
BtnLeft.addEventListener('click', () => {
	file.scrollLeft -= file.offsetWidth;

	const indicatorActive = document.querySelector('.indicator .active');
	if(indicatorActive.previousSibling){
		indicatorActive.previousSibling.classList.add('active');
		indicatorActive.classList.remove('active');
	}
});

// ? ----- ----- Pagination ----- -----
const numbersPag = Math.ceil(carouselImg.length / 5);
for(let i = 0; i < numbersPag; i++){
	const indicator = document.createElement('button');

	if(i === 0){
		indicator.classList.add('active');
	}

	document.querySelector('.indicator').appendChild(indicator);
	indicator.addEventListener('click', (e) => {
		file.scrollLeft = i * file.offsetWidth;

		document.querySelector('.indicator .active').classList.remove('active');
		e.target.classList.add('active');
	});
}

// ? ----- ----- Hover ----- -----
carouselImg.forEach((carouImg) => {
	carouImg.addEventListener('mouseenter', (e) => {
		const element = e.currentTarget;
		setTimeout(() => {
			carouselImg.forEach(carouImg => carouImg.classList.remove('hover'));
			element.classList.add('hover');
		}, 300);
	});
});

file.addEventListener('mouseleave', () => {
	carouselImg.forEach(carouImg => carouImg.classList.remove('hover'));
});