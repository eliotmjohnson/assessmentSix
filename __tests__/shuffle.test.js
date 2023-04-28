const { shuffle } = require("../src/shuffle");
const input = [1, 2, 3, 4, 5];

describe("shuffle should...", () => {
	test("Does shuffle return array", () => {
		expect(typeof shuffle()).toEqual("object");
	});

	test("Check length of input to return", () => {
		expect(shuffle(input).length).toEqual(input.length);
	});

	test("Check if same items are present", () => {
		let returnedArr = shuffle(input);
		for (let i = 0; i < input.length; i++) {
			expect(returnedArr.includes(input[i])).toBe(true);
		}
	});

	// This test will sometimes come back as failed because the arr was not fully shuffled. Which is a fault of the function!

	test("If array was shuffled fully", () => {
		let returnedArr = shuffle(input);
		console.log(returnedArr);
		console.log(input);
		for (let i = 0; i < input.length; i++) {
			expect(returnedArr.includes(input[i])).toBe(true);
			expect(returnedArr[i] === input[i]).toBeFalsy();
		}
	});
});
