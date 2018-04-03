/*const materialMap = {
	'dirt': 0,
	'metal': 1
}*/

const DND_SCENES = ["Crafter"]

const materialMap = [
	{
		id : "dirt",
		recipe: false,
		name: "dirt",
		materialSI: 0
	}, {
		id : "metal",
		recipe: false,
		name: "metal",
		materialSI: 1
	}, {
		id : "dirtdirt",
		recipe: ["dirt", "dirt"],
		name: "compact dirt",
		materialSI: 2
	},{
		id : "dirtmetal",
		recipe: ["dirt", "metal"],
		name: "dirty metal",
		materialSI: 3
	}, {
		id : "metalmetal",
		recipe: ["metal", "metal"],
		name: "reinfoced metal",
		materialSI: 4
	}
]