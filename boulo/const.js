/*const materialMap = {
	'dirt': 0,
	'metal': 1
}*/

const DND_SCENES = ["Crafter"]
const CRAFT_TILES_INDEXES = {
	"Crafter" : 2
}

const materialMap = [
	{
		id : "dirt",
		recipe: {},
		name: "dirt",
		materialSI: 0
	}, {
		id : "metal",
		recipe: {},
		name: "metal",
		materialSI: 1
	}, {
		id : "dirtdirt",
		recipe: {"dirt": 2},
		name: "compact dirt",
		materialSI: 2
	},{
		id : "dirtmetal",
		recipe: {"dirt":2, "metal":1},
		name: "dirty metal",
		materialSI: 3
	}, {
		id : "metalmetal",
		recipe: {"metal": 4},
		name: "reinforced metal",
		materialSI: 4
	}
]