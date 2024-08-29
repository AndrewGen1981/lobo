const normalBot = {
    class: "card",
    lifes: 3,       //  к-ть життів
    damage: 3,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const insaneBot = {
    class: "card -insane",
    lifes: 9,       //  к-ть життів
    damage: 8,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const easyBot = {
    class: "card -easy",
    lifes: 2,       //  к-ть життів
    damage: 2,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const easy2Bot = {
    class: "card -easy2",
    lifes: 14,       //  к-ть життів
    damage: 10,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const mediumBot = {
    class: "card -medium",
    lifes: 19,       //  к-ть життів
    damage: 15,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const hardBot = {
    class: "card -hard",
    lifes: 39,       //  к-ть життів
    damage: 28,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const harderBot = {
    class: "card -harder",
    lifes: 7,       //  к-ть життів
    damage: 6,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const hard1Bot = {
    class: "card -hard1",
    lifes: 5,       //  к-ть життів
    damage: 4,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const hard2Bot = {
    class: "card -hard2",
    lifes: 38,       //  к-ть життів
    damage: 20,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const extremeBot = {
    class: "card -extreme",
    lifes: 50,       //  к-ть життів
    damage: 40,      //  пошкодження при ударі
    step: 1,        //  крок на карті
}

const bots = [ normalBot, insaneBot, easyBot, easy2Bot, mediumBot, hardBot, harderBot, hard1Bot, hard2Bot, extremeBot ]


function init(cell, bot, team2) {
    if (!cell || !bot) return

    cell.classList = bot.class

    cell.classList.toggle("-team2", team2 === true)

    updateLifes(cell, bot.lifes)
    updateDamage(cell, bot.damage)

    cell.dataset.step = bot.step

    const name = (Math.random() + 1).toString(36).substring(7)
    cell.dataset.name = name

    return name
}

function updateLifes(card, lifes) {
    card.dataset.lifes = lifes
    card.style.setProperty("--lifes", `"${ lifes }"`)
}
function updateDamage(card, damage) {
    card.dataset.damage = damage
    card.style.setProperty("--damage", `"${ damage }"`)
}


function giveRandomBot(bots) {
    if (!bots?.length) return undefined

    const i = Math.floor(Math.random() * bots.length)
    return bots[i]
}


export {
    bots,
    init,
    updateLifes,
    updateDamage,
    giveRandomBot
}