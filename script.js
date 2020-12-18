const ctx = document.getElementById("canvas").getContext("2d");
const alkuluvut = [2];
const MAX = 1000000;
for (let i=3; i<=MAX; i++) {
    let flag = true;
    const sq = Math.sqrt(i);
    for (let j=0; alkuluvut[j]<=sq; j++) {
        if (i % alkuluvut[j] == 0) {
            flag = false;
            break;
        }
    }
    if (flag) {
        alkuluvut.push(i);
    }
}
console.log(alkuluvut);
const divHajotelma = document.getElementById("hajotelma");
const lukuKentta = document.getElementById("luku");

function luoHajotelma(n) {
    const hajotelma = {};
    const monesko = {};
    for (let i=0; i<alkuluvut.length; i++) {
        if (n == 1) {
            break;
        }
        const p = alkuluvut[i];
        while (n % p == 0) {
            n /= p;
            if (hajotelma.hasOwnProperty(p)) {
                hajotelma[p]++;
            } else {
                hajotelma[p] = 1;
                monesko[p] = i+1;
            }
        }
    }
    return [hajotelma, monesko];
}

function lukuPaivitetty() {
    const luku = lukuKentta.value;
    if (!luku || luku <= 0) {
        return;
    }
    const [hajotelma, monesko] = luoHajotelma(luku);
    console.log(luku);
    console.log(hajotelma);
    console.log(monesko);
    const tekijat = Object.getOwnPropertyNames(hajotelma);
    divHajotelma.innerHTML = "";
    for (let i=0; i<tekijat.length; i++) {
        const p = tekijat[i];
        if (i > 0) {
            divHajotelma.innerHTML += "×";
        }
        divHajotelma.innerHTML += p;
        if (hajotelma[p] > 1) {
            divHajotelma.innerHTML += "<sup>" + hajotelma[p] + "</sup>";
        }
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const lukuPuu = new LukuPuu(hajotelma, monesko);
    piirraPuu(lukuPuu, ctx.canvas.width / 2, 10);
}

class LukuPuu {
    constructor(hajotelma, monesko) {
        this.hajotelma = hajotelma;
        this.monesko = monesko;
        this.puu = [];
        let tekijat = Object.getOwnPropertyNames(hajotelma);
        for (let i=0; i<tekijat.length; i++) {
            const p = tekijat[i];
            const [pHajotelma, pMonesko] = luoHajotelma(monesko[p]);
            for (let j=0; j<hajotelma[p]; j++) {
                this.puu.push(new LukuPuu(pHajotelma, pMonesko));
            }
        }
    }

    leveys() {
        let leveys = this.puu.length > 0 ? 0 : 1;
        for (let i=0; i<this.puu.length; i++) {
            leveys += this.puu[i].leveys();
        }
        return leveys;
    }
}

function piirraPuu(lukuPuu, x, y) {
    const dy = 30;
    const dx = 24;
    let xp = x-(lukuPuu.leveys())*dx/2;
    console.log(lukuPuu);
    console.log(lukuPuu.leveys());
    for (let i=0; i<lukuPuu.puu.length; i++) {
        xp += lukuPuu.puu[i].leveys()*dx/2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xp, y+dy);
        ctx.stroke();
        piirraPuu(lukuPuu.puu[i], xp, y+dy);
        xp += lukuPuu.puu[i].leveys()*dx/2;
    }
}

lukuKentta.addEventListener("input", lukuPaivitetty);