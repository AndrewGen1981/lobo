import { bots, init, updateLifes, updateDamage, giveRandom } from "./bots.js"


const elements = [...document.querySelectorAll("main ul li")]


let team1 = [
    init(elements[0], giveRandom(bots), "team1"),
    init(elements[1], giveRandom(bots), "team1"),
    init(elements[2], giveRandom(bots), "team1"),
    init(elements[3], giveRandom(bots), "team1"),
    init(elements[4], giveRandom(bots), "team1"),
    init(elements[5], giveRandom(bots), "team1")
]

let team2 = [
    init(elements[42], giveRandom(bots), "team2"),
    init(elements[43], giveRandom(bots), "team2"),
    init(elements[44], giveRandom(bots), "team2"),
    init(elements[45], giveRandom(bots), "team2"),
    init(elements[46], giveRandom(bots), "team2"),
    init(elements[47], giveRandom(bots), "team2")
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



function turnToMove(team) {
    whosMove = team
    if (!team1Avatar || !team2Avatar) return

    team1Avatar.classList.toggle("-active", team === "team1")
    team2Avatar.classList.toggle("-active", team === "team2")
}



function checkWhosMove(card) {
    const autoPlay = document.querySelector("[name='autoplay']:checked")

    if (team1.includes(card.dataset.name) && whosMove === "team1") {
        turnToMove("team2")
        
        if (autoPlay.id === "team2")
            setTimeout(() => PCMakeMove([...document.querySelectorAll("li.card.team2")]), 1000)

        return true
    }
    if (team2.includes(card.dataset.name) && whosMove === "team2") {
        turnToMove("team1")

        if (autoPlay.id === "team1")
            setTimeout(() => PCMakeMove([...document.querySelectorAll("li.card.team1")]), 1000)


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

        attacked.classList.add("-dead")
        setTimeout(() => {
            attacked.classList = ""
            updateLifes(attacked, "💀")
            attacked.dataset.damage = ""
            attacked.dataset.step = ""

            if (attacked.dataset.name?.length) {
                team1 = team1.filter(bot => bot !== attacked.dataset.name)
                team2 = team2.filter(bot => bot !== attacked.dataset.name)
            }

        }, 1000)

        
    } else {
        updateLifes(attacked, leftLifes)
    }
}


const team1Avatar = document.querySelector("#teamAvatar1")
const team2Avatar = document.querySelector("#teamAvatar2")


document.querySelectorAll("[name='autoplay']")
.forEach(radio => radio.addEventListener("click", () => {
    setTimeout(() => PCMakeMove([...document.querySelectorAll(`li.card.${ radio.id }`)]), 1000)

    if (!team1Avatar || !team2Avatar) return
    if (radio.id === "team1") {
        team1Avatar.dataset.player = "pc"
        team2Avatar.dataset.player = "human"
    } else if (radio.id === "team2") {
        team1Avatar.dataset.player = "human"
        team2Avatar.dataset.player = "pc"
    } else {
        team1Avatar.dataset.player = "human"
        team2Avatar.dataset.player = "human"
    }
}))


let PCAttemptsToMove = 0
let justMovedOpponent = undefined


function PCMakeMove(botTeam) {
    const botToMove = giveRandom(botTeam)
    if (!botToMove) return
    if (!isMyMove(botToMove)) return

    const justMoved = document.querySelector("li.-active ")
    if (justMoved != botToMove) justMovedOpponent = justMoved

    botToMove.click()

    const autoPlay = document.querySelector("[name='autoplay']:checked")
    const dy = autoPlay.id === "team1" ? 6 : -6

    const deltaX = [-1, 0, 1, 0]
    const dx = giveRandom(deltaX)

    const index = parseInt(botToMove.dataset.index) + dy +dx
    const cellTo = document.querySelector(`[data-index="${ index }"]`)

    const isOccupiedByBot = cellTo?.classList?.contains("card")
    const whosTeamAmI = team1.includes(botToMove.dataset.name) ? "team1" : "team2"
    const isOccupiedByMyTeamBot = isOccupiedByBot && cellTo.classList.contains(whosTeamAmI)

    if (!cellTo || isOccupiedByMyTeamBot) {
        if (PCAttemptsToMove < 5) {
            PCAttemptsToMove ++
            PCMakeMove(botTeam)
        } else {
            PCAttemptsToMove = 0
            return
        }
    }

    cellTo.click()

    if (justMovedOpponent) justMovedOpponent.click()
}
