const normalBot = {
    class: "card",
    lifes: 3,       //  к-ть життів
    damage: 3,      //  пошкодження при ударі
}

const naBot = {
    class: "card -na",
    lifes: 1,       //  к-ть життів
    damage: 0,      //  пошкодження при ударі
}

const autoBot = {
    class: "card -auto",
    lifes: 1,       //  к-ть життів
    damage: 1,      //  пошкодження при ударі
}

const insaneBot = {
    class: "card -insane",
    lifes: 9,       //  к-ть життів
    damage: 8,      //  пошкодження при ударі
}

const pacificBot = {
    class: "card -pacific",
    lifes: 10,       //  к-ть життів
    damage: 11,      //  пошкодження при ударі
}

const easyBot = {
    class: "card -easy",
    lifes: 2,       //  к-ть життів
    damage: 2,      //  пошкодження при ударі
}

const easy2Bot = {
    class: "card -easy2",
    lifes: 14,       //  к-ть життів
    damage: 10,      //  пошкодження при ударі
}

const mediumBot = {
    class: "card -medium",
    lifes: 19,       //  к-ть життів
    damage: 15,      //  пошкодження при ударі
}

const hardBot = {
    class: "card -hard",
    lifes: 39,       //  к-ть життів
    damage: 28,      //  пошкодження при ударі
}

const harderBot = {
    class: "card -harder",
    lifes: 7,       //  к-ть життів
    damage: 6,      //  пошкодження при ударі
}

const hard1Bot = {
    class: "card -hard1",
    lifes: 5,       //  к-ть життів
    damage: 4,      //  пошкодження при ударі
}

const hard2Bot = {
    class: "card -hard2",
    lifes: 38,       //  к-ть життів
    damage: 20,      //  пошкодження при ударі
}

const extremeBot = {
    class: "card -extreme",
    lifes: 50,       //  к-ть життів
    damage: 40,      //  пошкодження при ударі
}

const bots = [ normalBot, naBot, autoBot, insaneBot, pacificBot, easyBot, easy2Bot, mediumBot, hardBot, harderBot, hard1Bot, hard2Bot, extremeBot ]


function init(cell, bot, team) {
    if (!cell || !bot) return

    cell.classList = bot.class

    if (team) cell.classList.add(team)

    updateLifes(cell, bot.lifes)
    updateDamage(cell, bot.damage)

    const name = (Math.random() + 1).toString(36).substring(7)
    cell.dataset.name = name

    return name
}

function updateLifes(card, lifes) {
    if (!card) return
    card.dataset.lifes = lifes
    card.style.setProperty("--lifes", `"${ lifes }"`)
}
function updateDamage(card, damage) {
    if (!card) return
    card.dataset.damage = damage
    card.style.setProperty("--damage", `"${ damage }"`)
}


function giveRandom(arr) {
    if (!arr?.length) return undefined

    const i = Math.floor(Math.random() * arr.length)
    return arr[i]
}


export {
    bots,
    init,
    updateLifes,
    updateDamage,
    giveRandom
}