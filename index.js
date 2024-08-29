import { bots, init, updateLifes, updateDamage, giveRandomBot } from "./bots.js"


const elements = [...document.querySelectorAll("main ul li")]


const team1 = [
    init(elements[0], giveRandomBot(bots)),
    init(elements[1], giveRandomBot(bots)),
    init(elements[2], giveRandomBot(bots)),
    init(elements[3], giveRandomBot(bots)),
    init(elements[4], giveRandomBot(bots)),
    init(elements[5], giveRandomBot(bots))
]

const team2 = [
    init(elements[42], giveRandomBot(bots), true),
    init(elements[43], giveRandomBot(bots), true),
    init(elements[44], giveRandomBot(bots), true),
    init(elements[45], giveRandomBot(bots), true),
    init(elements[46], giveRandomBot(bots), true),
    init(elements[47], giveRandomBot(bots), true)
]


let whosMove = "team1"


elements.forEach((li, index) => {

    li.dataset.index = index + 1

    li.addEventListener("click", () => {
        if (li.classList.contains("card")) {        //  сота з картинкою
            
            const active = elements.find(el => el.classList.contains("-active"))
            if (active) {
                if (active.dataset.name !== li.dataset.name) {
                    if (ifInMyArea(active, li, 1) && isMyMove(active) ) {
                        return attack(active, li, 1)
                    }
                }
            }
            
            if (!li.classList.contains("-active")) {
                elements.forEach(el => el.classList.remove("-active"))
            }
            li.classList.toggle("-active")
        } else {        //  сота без картинки
            const card = elements.find(el => el.classList.contains("card") && el.classList.contains("-active"))
            if (card) move(card, li, 1)
        }
    })

})



function ifInMyArea(card, toCell, step) {
    // 9 => 8,10   2,3,4    14,15,16
    const c = parseInt(card.dataset.index)
    const t = parseInt(toCell.dataset.index)

    const dist = Math.abs(t - c)
    const diff = Math.abs(dist - (6 * step))

    return diff === 0  || diff <= step || dist <= step
}


function isMyMove(card) {
    return (team1.includes(card.dataset.name) && whosMove === "team1") ||
    (team2.includes(card.dataset.name) && whosMove === "team2")
}


function checkWhosMove(card) {
    

    if (team1.includes(card.dataset.name) && whosMove === "team1") {
        whosMove = "team2"
        return true
    }
    if (team2.includes(card.dataset.name) && whosMove === "team2") {
        whosMove = "team1"
        return true
    }

    card.classList.add("-hidden")
    setTimeout(() => card.classList.remove("-hidden"), 1000)
    return false
}


function move(card, toCell, step) {
    if (!checkWhosMove(card)) return
    if (!ifInMyArea(card, toCell, step)) return

    toCell.classList = card.classList
    
    updateLifes(toCell, card.dataset.lifes)
    updateLifes(card, "")

    updateDamage(toCell, card.dataset.damage)
    updateDamage(card, "")

    toCell.dataset.step = card.dataset.step
    card.dataset.step = ""

    toCell.dataset.name = card.dataset.name
    card.dataset.name = ""

    card.classList = []
}



function attack(card, attacked, step) {
    if (!checkWhosMove(card)) return
    if (!ifInMyArea(card, attacked, step)) return
    if (card === attacked) return

    if (team1.includes(card) && team1.includes(attacked)) return
    if (team2.includes(card) && team2.includes(attacked)) return

    attacked.classList.add("-attacked")
    setTimeout(() => attacked.classList.remove("-attacked"), 500)

    const lifes = parseInt(attacked.dataset.lifes || 0)
    const damage = parseInt(card.dataset.damage || 0)

    const leftLifes = lifes - damage

    if (leftLifes <= 0) {
        attacked.classList = ""
        updateLifes(attacked, "")
        attacked.dataset.damage = ""
        attacked.dataset.step = ""
    } else {
        updateLifes(attacked, leftLifes)
    }
}
