import { upgrades } from "./upgrades.js"
import { giveRandom, updateLifes, updateDamage } from "./bots.js"

const dialog = document.querySelector("#dialog")
const bot = dialog && dialog.querySelector("ul.upgradedBot .card")

const upgradeCards = dialog.querySelectorAll("ul.upgrades li")


upgradeCards.forEach(upgradeCard => upgradeCard.addEventListener("click", () => {
    const upLifes = parseInt(upgradeCard.dataset.lifes || 0)
    const upDamage = parseInt(upgradeCard.dataset.damage || 0)

    if (!upLifes && !upDamage) return

    upgradeCard.removeAttribute("data-lifes")
    upgradeCard.removeAttribute("data-damage")

    const lifesHTML = upLifes ? upLifes > 0 ? `<p class="lifes">+${ upLifes }</p>` : `<p class="lifes minus">${ upLifes }</p>` : ""
    const damageHTML = upDamage ? upDamage > 0 ? `<p class="damage">+${ upDamage }</p>` : `<p class="damage minus">${ upDamage }</p>` : ""

    upgradeCard.classList.add("-flip")
    setTimeout(() => {
        upgradeCard.classList.remove("-flip")
        upgradeCard.classList.add("-flipped")

        upgradeCard.innerHTML = `${ lifesHTML }${ damageHTML }`

        const botLifes = parseInt(bot.dataset.lifes || 0)
        const botDamage = parseInt(bot.dataset.damage || 0)

        const newBotLifes = botLifes + upLifes
        const newBotDamage = botDamage + upDamage

        const lifesToSet = newBotLifes > 0 ? newBotLifes : 0
        const damageToSet = newBotDamage > 0 ? newBotDamage : 0

        updateLifes(bot, lifesToSet)
        updateDamage(bot, damageToSet)

        const botPlayer = document.querySelector(`main ul li.card[data-name="${ bot.dataset.name }"]`)
        updateLifes(botPlayer, lifesToSet)
        updateDamage(botPlayer, damageToSet)

        upgradeCards.forEach(upCard => {
            upCard.classList.toggle("-hidden", upCard != upgradeCard)
            upCard.removeAttribute("data-lifes")
            upCard.removeAttribute("data-damage")
        })
    }, 350)

    // setTimeout(() => {
    //     dialog.close()

    //     bot.classList = []
    //     bot.removeAttribute("data-name")
    //     bot.removeAttribute("data-lifes")
    //     bot.removeAttribute("data-damage")
    //     bot.style.removeProperty("--lifes")
    //     bot.style.removeProperty("--damage")

    //     upgradeCards.forEach(upCard => {
    //         upCard.classList = []
    //         upCard.innerHTML = ""
    //     })
    // }, 2000)

}))


export function updateDialog(me) {
    bot.classList = me.classList
    bot.classList.remove("-active")

    bot.style.setProperty("--lifes", me.style.getPropertyValue("--lifes"))
    bot.style.setProperty("--damage", me.style.getPropertyValue("--damage"))

    bot.dataset.name = me.dataset.name
    bot.dataset.lifes = me.dataset.lifes
    bot.dataset.damage = me.dataset.damage

    upgradeCards.forEach(li => {
        const upgrade = giveRandom(upgrades)
        li.dataset.lifes = upgrade.lifes || 0
        li.dataset.damage = upgrade.damage || 0
    })

    dialog.showModal()
}