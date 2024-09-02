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

const firstToMove = elements[0]
firstToMove.classList.add("-active")    //  highlight for 1st move


elements.forEach((li, index) => {

    li.dataset.index = index + 1

    li.addEventListener("click", () => {
        if (li.classList.contains("card")) {        //  сота з картинкою
            
            const active = elements.find(el => el.classList.contains("-active"))
            if (active) {
                if (active.dataset.name !== li.dataset.name) {
                    if (ifInMyArea(active, li, 1) && isMyMove(active) ) {
                        if (attack(active, li, 1)) return
                    }
                }
            }
            
            if (!li.classList.contains("-active")) {
                elements.forEach(el => el.classList.remove("-active"))
            }

            li.classList.toggle("-active")
            showAvailable(li)
        } else {        //  сота без картинки
            const card = elements.find(el => el.classList.contains("card") && el.classList.contains("-active"))
            if (card) move(card, li)
        }
    })

})


showAvailable(firstToMove, whosMove)


function getAvailableMatrix(me) {
    const c = parseInt(me?.dataset?.index || -1)
    if (c === -1) return []

    const p = c - 6     //  previouse row
    const n = c + 6     //  next row

    const lb = ((c - 1) % 6) !== 0      //  left boundary
    const rb = (c % 6) !== 0      //  right boundary

    return [
        lb && (p - 1), p, rb && (p + 1),
        lb && (c - 1), 0, rb && (c + 1),
        lb && (n - 1), n, rb && (n + 1)
    ].filter(ac => ac > 0)
}


function showAvailable(me, myTeam) {
    if (!me) return
    const availableMatrix = getAvailableMatrix(me)
    const team = myTeam || indetifyMyTeam(me)

    elements.forEach(el => {
        const i = parseInt(el?.dataset?.index || -100)
        el.dataset[`${ team }Can`] = availableMatrix.includes(i)
    })
}



function ifInMyArea(me, to) {
    const t = parseInt(to?.dataset?.index || -1)
    if (t === -1) return

    const availableMatrix = getAvailableMatrix(me)
    return availableMatrix.includes(t)
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


function move(card, dest) {
    if (!isMyMove(card)) return
    if (!ifInMyArea(card, dest)) return

    dest.classList = card.classList
    
    updateLifes(dest, card.dataset.lifes)
    updateLifes(card, "")

    updateDamage(dest, card.dataset.damage)
    updateDamage(card, "")

    dest.dataset.name = card.dataset.name

    card.removeAttribute("data-lifes")
    card.removeAttribute("data-damage")
    card.removeAttribute("data-name")

    card.classList = []

    const team =indetifyMyTeam(dest)
    const opponentBase = team === "team1" ? "2" : "1"
    const allMyPlayers = [...document.querySelectorAll(`li.card.${ team }`)]
    const allMyPlayersInOpponentBase = allMyPlayers.every(p => p.dataset.base === opponentBase)

    if (allMyPlayersInOpponentBase) congrats(`${ team === "team1" ? "Blue" : "Red" } Team Win!`, dest)        

    const phrase = giveRandom(movePhrases)
    say(dest, phrase.req, phrase.res)

    showAvailable(dest, team)
    checkWhosMove(dest)     //  toggle move to the opponent
}


const movePhrases = [
    {
        req: "my move",
        res: "go ahead!"
    },
    {
        req: "my turn",
        res: "I'm waiting"
    },
    {
        req: "Watch out!",
        res: "Missed!"
    },
    {
        req: "Hey, bro",
        res: "What?"
    },
    {
        req: "Looser!",
        res: "#@$%!"
    },
    {
        req: "What's up?",
        res: "uppuup!"
    },
]


function congrats(msg, me) {
    say(me, "I won!", "no...")
    setTimeout(() => {
        alert(`🎉 ${ msg } 🚀`)
        location.reload()
    }, 1000)
}


function attack(card, attacked) {
    if (!isMyMove(card)) return
    if (!ifInMyArea(card, attacked)) return
    if (card === attacked) return

    // cannot attack your team-mate
    if (team1.includes(card.dataset.name) && team1.includes(attacked.dataset.name)) return
    if (team2.includes(card.dataset.name) && team2.includes(attacked.dataset.name)) return

    attacked.classList.add("-attacked")
    setTimeout(() => attacked.classList.remove("-attacked"), 500)

    const lifes = parseInt(attacked.dataset.lifes || 0)
    const damage = parseInt(card.dataset.damage || 0)

    const leftLifes = lifes - damage

    if (leftLifes <= 0) {

        if (attacked.dataset.name?.length) {
            team1 = team1.filter(bot => bot !== attacked.dataset.name)
            team2 = team2.filter(bot => bot !== attacked.dataset.name)
            attacked.dataset.name += "_dead"
        }

        updateLifes(attacked, "💀")
        updateDamage(attacked, "")
        
        attacked.classList.add("-dead")
        setTimeout(() => attacked.classList = [], 1000)

        if (team1.length === 0) congrats ("Red Team Win!", card)
        if (team2.length === 0) congrats ("Blue Team Win!", card)
        
    } else {
        updateLifes(attacked, leftLifes)
    }

    say(card, "ha-ha, beat you!", "ouch...")
    checkWhosMove(card)     //  toggle move to the opponent
}


const team1Avatar = document.querySelector("#teamAvatar1")
const team2Avatar = document.querySelector("#teamAvatar2")

const text1 = document.querySelector("#team1Text")
const text2 = document.querySelector("#team2Text")


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

    // move or attack
    const isThereOpponentToAttack = findEnemyToAttack(botToMove)
    const actionOptions = [ isThereOpponentToAttack ? "attack" : "move", "move" ]
    const action = giveRandom(actionOptions)    //  50/50 chances to attack(it there is someone) or move

    if (isThereOpponentToAttack && action === "attack") return isThereOpponentToAttack.click()

    const autoPlay = document.querySelector("[name='autoplay']:checked")
    const dy = autoPlay.id === "team1" ? 6 : -6

    const deltaX = [-1, 0, 1, 0]
    const dx = giveRandom(deltaX)

    const index = parseInt(botToMove.dataset.index) + dy +dx
    const cellTo = document.querySelector(`[data-index="${ index }"]`)

    const isOccupiedByBot = cellTo?.classList?.contains("card")
    const whosTeamAmI = indetifyMyTeam(botToMove)
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

    if (cellTo) cellTo.click()

    if (justMovedOpponent) justMovedOpponent.click()
}


function indetifyMyTeam(me) {
    if (!me) return
    return me.classList.contains("team1") ? "team1" : "team2"
}

function indetifyMyOpponentTeam(me) {
    if (!me) return
    return me.classList.contains("team1") ? "team2" : "team1"
}


// where to seek whom to fight with
const attackArea = [
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 }
]


function findEnemyToAttack(me) {
    if (!me) return

    const index = parseInt(me.dataset.index || -1)
    if (index === -1) return

    const opponentTeam = indetifyMyOpponentTeam(me)
    if (!opponentTeam) return

    const isThereOpponentToAttack = attackArea.filter(d => {
        const i = index + d.x + 6*d.y
        return (i > 0) && document.querySelector(`li.card.${ opponentTeam }[data-index="${ i }"]`)
    })

    if (isThereOpponentToAttack.length === 0) return false      //  noone nearby

    const d1st = isThereOpponentToAttack[0]
    const firstOppenentBot = document.querySelector(`li.card.${ opponentTeam }[data-index="${ index + d1st.x + 6*d1st.y }"]`)

    if (isThereOpponentToAttack.length === 1) return firstOppenentBot      //  only one nearby

    // if surrounded by couple of enemies, then pick the weakest one
    const theWeakest = isThereOpponentToAttack.find(d => {
        const opponentBot = document.querySelector(`li.card.${ opponentTeam }[data-index="${ index + d.x + 6*d.y }"]`)
        return parseInt(opponentBot?.dataset.lifes || -100) < parseInt(firstOppenentBot.dataset.lifes)
    })

    return theWeakest ? document.querySelector(`li.card.${ opponentTeam }[data-index="${ index + theWeakest.x + 6*theWeakest.y }"]`) : firstOppenentBot
}


function say(card, msg, resp) {
    if (!text1 || !text2 || !card) return

    if (indetifyMyTeam(card) === "team1") {
        text1.innerText = msg
        text2.innerText = resp
    } else {
        text2.innerText = msg
        text1.innerText = resp
    }
}