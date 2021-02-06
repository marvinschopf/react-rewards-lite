/**
 * rewards-lite
 * Copyright (c) 2021 Marvin Schopf
 * Copyright (c) 2018-2020 thedevelobear
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * @license MIT
 * 
 */

const PI = Math.PI;
const defaultColors = ["#A45BF1", "#25C6F6", "#72F753", "#F76C88", "#F5F770"];

const createElements = (root, elementCount, elementSize, zIndex, colors) =>
	Array.from({ length: elementCount }).map((_, index) => {
		const element = document.createElement("span");
		const color = colors[index % colors.length];
		element.style["background-color"] = color;
		element.style.width = `${elementSize}px`;
		element.style.height = `${elementSize}px`;
		element.style.position = "absolute";
		element.style.zIndex = zIndex;
		root.appendChild(element);
		return element;
	});

const radiansFrom = (degrees) => degrees * (PI / 180);

const generatePhysics = (angle, spread, startVelocity, random) => {
	const radAngle = radiansFrom(angle);
	const radSpread = radiansFrom(spread);
	return {
		x: 0,
		y: 0,
		wobble: random() * 10,
		velocity: startVelocity * 0.5 + random() * startVelocity,
		angle2D: -radAngle + (0.5 * radSpread - random() * radSpread),
		angle3D: -(PI / 4) + random() * (PI / 2),
		tiltAngle: random() * PI,
	};
};

const updateFetti = (fetti, progress, decay, index) => {
	fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
	fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
	fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
	fetti.physics.wobble += 0.05;
	fetti.physics.velocity *= decay;
	fetti.physics.y += 3.5;
	fetti.physics.tiltAngle += 0.15;

	const { x, y, tiltAngle, wobble } = fetti.physics;
	const wobbleX =
		index % 2 === 0
			? x + (6 * Math.sin(wobble) + progress)
			: x + (12 * Math.cos(wobble) + progress);
	const wobbleY = y + 5 * Math.sin(wobble);
	const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`;

	fetti.element.style.transform = transform;
	fetti.element.style.scale = 1 - 0.2 * progress;
	fetti.element.style.opacity = 1 - progress;
};

const animate = (root, fettis, decay, lifetime) => {
	const totalTicks = lifetime;
	let tick = 0;

	const update = () => {
		fettis.forEach((fetti, index) =>
			updateFetti(fetti, tick / totalTicks, decay, index)
		);

		tick += 1;
		if (tick < totalTicks) {
			window.requestAnimationFrame(update);
		} else {
			fettis.forEach((fetti) => {
				if (fetti.element.parentNode === root) {
					return root.removeChild(fetti.element);
				}
			});
		}
	};

	window.requestAnimationFrame(update);
};

const confetti = (
	root,
	{
		elementCount = 50,
		elementSize = 8,
		colors = defaultColors,
		angle = 90,
		spread = 45,
		decay = 0.9,
		lifetime = 200,
		startVelocity = 35,
		zIndex = 0,
		random = Math.random,
	} = {}
) => {
	const elements = createElements(
		root,
		elementCount,
		elementSize,
		zIndex,
		colors
	);
	const fettis = elements.map((element) => ({
		element,
		physics: generatePhysics(angle, spread, startVelocity, random),
	}));

	animate(root, fettis, decay, lifetime);
};
export default confetti;
