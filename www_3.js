const http = require('http');
//moodul URL-i parsimiseks
const url = require('url');
//moodul failiteede haldamiseks
const path = require('path');
//const fs = require('fs');
const fs = require('fs').promises;
const dateET = require('./src/dateTimeET');
const pageHead = '<!DOCTYPE html>\n<html lang="et">\n<head>\n\t<meta charset="utf-8">\n\t<title>Andrus Rinde, veebiprogrammeerimine</title>\n</head>\n<body>\n';
const pageBanner = '\t<img src="veebiprogrammeerimine_2026_ID.png" alt="bänner">\n';
const pageBody = '\t<h1>Andrus Rinde, veebiprogrammeerimine</h1>\n\t <p>See leht on loodud veebiprogrammeerimise kursusel <a href="https://www.tlu.ee">Tallinna Ülikoolis</a> ning ei sislda tõsiseltvõetavat sisu!</p>\n\t<p>Esialgu tutvusime lihtsalt HTML keelega, nüüd juba programmeerime.</p>\n\t<hr>';
const pageFoot = '\n</body>\n</html>';

http.createServer(async function(req, res){
	//vaatan URL-i
	console.log('Päring: ' + req.url);
	//parsin URL-i
	let currentURL = url.parse(req.url, true);
	console.log('Parsituna: ' + currentURL.pathname);
	const fileExt = path.extname(currentURL.pathname);
	//console.log('Parsituna: ' + currentURL.port);
	
	if(currentURL.pathname === '/'){
		res.writeHead(200, {"Content-type": "text/html"});
		//res.write('Veebiserver käivitus!');
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\t<img src="kass.jpg" alt="Kass">\n');
		res.write('\t<ul>\n');
		res.write('\t\t<li><a href="/vanasona">Tänane vanasõna</a></li>\n');
		res.write('\t\t<li><a href="/minust">Minust</a></li>\n');
		res.write('\t</ul>\n');
		res.write('\n\t<p>Täna on ' + dateET.day() + ', ' + dateET.date(Math.round(Math.random())) + ', kell oli lehe avamise hetkel: ' + dateET.time() +'.</p>');
		res.write(pageFoot);
		return res.end();
	}
	
	else if (currentURL.pathname === '/vanasona'){
		res.writeHead(200, {"Content-type": "text/html"});
		//res.write('Veebiserver käivitus!');
		res.write(pageHead);
		res.write(pageBanner);
		res.write('\t<h1>Tänane Eesti vanasõna</h1>\n\t<p>Siin näed tänaseks päevaks loositud vanasõna.</p>\n\t<hr>');
		
		try {
			let vanasonad = await fs.readFile('./txt/vanasonad.txt', 'utf8');
			let vanasonadeList = vanasonad.split(';');
			let juhuslik = Math.floor(Math.random() * vanasonadeList.length);
			res.write('\t<p>' + vanasonadeList[juhuslik] + '</p>\n');
		} catch (err) {
			res.write('\t<p>Vanasõna ei õnnestunud laadida.</p>\n');
		}
		
		res.write('\t<p><a href="/">Tagasi avalehele</a></p>\n');
		res.write(pageFoot);
		return res.end();
	}
	
	else if (currentURL.pathname === '/minust'){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write('\t<h1>Minust</h1>\n');
		res.write('\t<p>Tulin Tallinna Ülikooli õppima, sest mind huvitab informaatika ja soovin selles valdkonnas rohkem teadmisi saada.</p>\n');
		res.write('\t<img src="avatar.jpg" alt="Avatar">\n');
		res.write('\t<p><a href="/">Tagasi avalehele</a></p>\n');
		res.write(pageFoot);
		return res.end();
	}
	
	else if (fileExt === '.jpg'){
		let imagePath = path.join(__dirname, 'pic', currentURL.pathname);
		try {
			const data = await fs.readFile(imagePath);
			res.writeHead(200, {"Content-type": "image/jpeg"});
			return res.end(data);
		} catch (err) {
			res.writeHead(404, {"Content-type": "text/plain; charset=utf8"});
			return res.end('Pilti ei leitud!');
		}
	}
	
	else if (currentURL.pathname === '/veebiprogrammeerimine_2026_ID.png'){
		//liidame kättesaamatu päris kataloog jms virtuaalseks failiteeks
		let bannerPath = path.join(__dirname, 'pic', currentURL.pathname);
		try {
			const data = await fs.readFile(bannerPath);
			res.writeHead(200, {"Content-type": "image/png"});
			return res.end(data);
		} catch (err) {
			res.writeHead(404, {"Content-type": "text/plain; charset=ut8"});
			return res.end('Pilti ei leitud!');
		}
	}
	
	/* else if (currentURL.pathname === '/veebiprogrammeerimine_2026_ID.png'){
		//liidame kättesaamatu päris kataloog jms virtuaalseks failiteeks
		let bannerPath = path.join(__dirname, 'pic', currentURL.pathname);
		console.log('Bänneri failitee: ' + bannerPath);
		fs.readFile(bannerPath, (err, data)=>{
			if(err){
				throw(err);
			} else {
				res.writeHead(200, {"Content-type": "image/png"});
				res.end(data);
			}
		});
	} */
	
	else {
		return res.end('Viga 404! Ei leia sellist lehte!');
	}
}).listen(5221);