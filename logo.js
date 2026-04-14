
var themtBasePath ='/theme/es-theme-carbon/art/logos/';
var systemLogo = {
    "3do":"3do.svg", 
    "3ds":"3ds.svg", 
    "3ds-w":"3ds-w.svg", 
    "64dd":"64dd.svg", 
    "aae":"aae.png", 
    "acclaim":"acclaim.svg", 
    "ags":"ags.svg", 
    "alg":"alg.png", 
    "alphadenshi":"alphadenshi.png", 
    "amcoe":"amcoe.png", 
    "amiga":"amiga.svg", 
    "amiga1200":"amiga1200.svg", 
    "amiga1200-w":"amiga1200-w.svg", 
    "amiga500":"amiga500.svg", 
    "amiga500-w":"amiga500-w.svg", 
    "amigacd32":"amigacd32.svg", 
    "amigacd32-w":"amigacd32-w.svg", 
    "amigacdtv":"amigacdtv.svg", 
    "amigacdtv-w":"amigacdtv-w.svg", 
    "amstradcpc":"amstradcpc.svg", 
    "amstradcpc-w":"amstradcpc-w.svg", 
    "apple2":"apple2.svg", 
    "apple2-w":"apple2-w.svg", 
    "apple2gs":"apple2gs.svg", 
    "apple2gs-w":"apple2gs-w.svg", 
    "arcade":"arcade.svg", 
    "artfury":"artfury.png", //add + image
    "astrocade":"astrocade.svg", 
    "atari":"atari.svg", 
    "atari2600":"atari2600.svg", 
    "atari5200":"atari5200.svg", 
    "atari7800":"atari7800.svg", 
    "atari7800-w":"atari7800-w.svg", 
    "atari800":"atari800.svg", 
    "atarijaguar":"atarijaguar.svg", 
    "atarijaguarcd":"atarijaguarcd.png", 
    "atarilynx":"atarilynx.svg", 
    "atarist":"atarist.svg", 
    "atarist-w":"atarist-w.svg", 
    "atlus":"atlus.png", 
    "atlus":"atlus.svg", 
    "atomiswave":"atomiswave.svg", 
    "atomiswave-w":"atomiswave-w.svg", 
    "auto-allgames":"auto-allgames.svg", 
    "auto-allgames-es":"auto-allgames-es.svg", 
    "auto-allgames-fr":"auto-allgames-fr.svg", 
    "auto-at2players":"auto-at2players.png", 
    "auto-at2players-es":"auto-at2players-es.png", 
    "auto-at2players-fr":"auto-at2players-fr.png", 
    "auto-at4players":"auto-at4players.png", 
    "auto-at4players-es":"auto-at4players-es.png", 
    "auto-at4players-fr":"auto-at4players-fr.png", 
    "auto-favorites":"auto-favorites.svg", 
    "auto-favorites-es":"auto-favorites-es.svg", 
    "auto-favorites-fr":"auto-favorites-fr.svg", 
    "auto-lastplayed":"auto-lastplayed.svg", 
    "auto-lastplayed-es":"auto-lastplayed-es.svg", 
    "auto-lastplayed-fr":"auto-lastplayed-fr.svg", 
    "auto-lightgun":"auto-lightgun.png", 
    "auto-neverplayed":"auto-neverplayed.svg", 
    "auto-neverplayed-es":"auto-neverplayed-es.svg", 
    "auto-neverplayed-fr":"auto-neverplayed-fr.svg", 
    "auto-retroachievements":"auto-retroachievements.png", 
    "auto-verticalarcade":"auto-verticalarcade.svg", 
    "auto-verticalarcade-es":"auto-verticalarcade-es.svg", 
    "banpresto":"banpresto.svg", 
    "bbcmicro":"bbcmicro.svg", 
    "btmups":"btmups.png", //add +image
    "c128":"c128.svg", 
    "c20":"c20.svg", 
    "c64":"c64.svg", 
    "cannonball":"cannonball.png", 
    "capcom":"capcom.png", 
    "cave":"cave.png", 
    "cavestory":"cavestory.svg", 
    "centurye":"centurye.png", 
    "channelf":"channelf.svg", 
    "channelf-w":"channelf-w.svg", 
    "chihiro":"chihiro.svg", 
    "chrome":"chrome.png", //add +image
    "cinema":"cinema.png", //add +image
    "cinematronics":"cinematronics.png", 
    "coco":"coco.svg", 
    "coleco":"coleco.svg", 
    "colecovision":"colecovision.svg", 
    "comad":"comad.png", 
    "cplus4":"cplus4.png", 
    "cps1":"cps1.png", 
    "CPS1":"cps1.png", 
    "cps2":"cps2.png", 
    "CPS2":"cps2.png", 
    "cps3":"cps3.png", 
    "CPS3":"cps3.png", 
    "custom-collections":"custom-collections.svg", 
    "custom-collections-es":"custom-collections-es.svg", 
    "daphne":"daphne.png", 
    "daphne":"daphne.svg", 
    "dataeast":"dataeast.png", 
    "desktop":"desktop.svg", 
    "desligar":"desligar.png", //add +image
    "devilutionx":"devilutionx.png", 
    "dragon32":"dragon32.svg", 
    "dreamcast":"dreamcast.svg", 
    "dreamcast-w":"dreamcast-w.svg", 
    "dynax":"dynax.png", 
    "easyrpg":"easyrpg.svg", 
    "eighting":"eighting.png", 
    "exidy":"exidy.png", 
    "fba":"fba.svg", 
    "fba_libretro":"fba_libretro.png", //add +image
    "fbneo":"fbneo.png", 
    "fds":"fds.svg", 
    "famicom":"famicom.svg", //add +image
    "firefox":"firefox.png", //add +image
    "flash":"flash.svg", 
    "flash-w":"flash-w.svg", 
    "flatpak":"flatpak.webp", //add +image
    "fmtowns":"fmtowns.svg", 
    "fpinball":"fpinball.png", 
    "gaelco":"gaelco.png", 
    "gameandwatch":"gameandwatch.svg", 
    "gamecube":"gamecube.png", //add +image
    "gamegear":"gamegear.svg", 
    "gamegear-w":"gamegear-w.svg", 
    "gamegearh":"gamegearh.webp", //add +image
    "gamepass":"gamepass.png", //add +image
    "gb":"gb.svg", 
    "gb2players":"gb2players.png", 
    "gba":"gba.svg", 
    "gbc":"gbc.svg", 
    "gbc2players":"gbc2players.png", 
    "gc":"gc.svg", 
    "gc-w":"gc-w.svg", 
    "genesis":"genesis.svg", 
    "gottlieb":"gottlieb.svg", 
    "gw":"gw.webp", //add +image
    "gx4000":"gx4000.svg", 
    "hbmame":"hbmame.png", 
    "hikaru":"hikaru.svg", 
    "igs":"igs.png", 
    "imageviewer":"imageviewer.svg", 
    "imageviewer-w":"imageviewer-w.svg", 
    "incredibletech":"incredibletech.png", 
    "intellivision":"intellivision.svg", 
    "intellivision-w":"intellivision-w.svg", 
    "internet":"internet.png", //add +Image
    "irem":"irem.svg", 
    "jaguar":"atarijaguar.svg", // add
    "jaleco":"jaleco.png", 
    "kaneko":"kaneko.svg", 
    "kodi":"kodi.svg", 
    "kof":"kof.png",  //add
    "konami":"konami.svg", 
    "library":"library.svg", 
    "library-w":"library-w.svg", 
    "lightgun":"lightgun.png", 
    "love":"love.svg", 
    "lutro":"lutro.svg", 
    "lynx":"atarilynx.svg", //add
    "macintosh":"macintosh.svg", 
    "mame":"mame.svg", 
    "mame-advmame":"mame-advmame.svg", 
    "mame-libretro":"mame-libretro.svg", 
    "mame-mame4all":"mame-mame4all.svg", 
    "mame-w":"mame-w.svg", 
    "mame078plus":"mame078plus.png", //add
    "mame139":"mame139.png", //add +img
    "mame200":"mame200.png", //add +img
    "mame2003plus":"mame2003plus.png", //add +img
    "mame2010":"mame2010.png", //add +img
    "mame2015":"mame2015.png", //add +img
    "mame2016":"mame2016.png", //add +img
    "mame237":"mame237.png", //add +img
    "mame78plus":"mame078plus.png", //add +img
    "mario":"mario.png", //add +image
    "mastersystem":"mastersystem.svg", 
    "mastersystembr":"mastersystembr.webp", //add +image
    "mastersystemh":"mastersystemh.webp", //add +image
    "megadrive":"megadrive.svg", 
    "megadrivebr":"megadrivebr.webp", //add +image
    "megadriveh":"megadriveh.png", //add +image
    "megaplay":"megaplay.png", 
    "megatech":"megatech.png", 
    "mess":"mess.svg", 
    "midway":"midway.svg", 
    "mitchell":"mitchell.png", 
    "mk":"mk.png", // add +image
    "model2":"model2.png", 
    "model3":"model3.png", 
    "moonlight":"moonlight.svg", 
    "mrboom":"mrboom.svg", 
    "mslug":"mslug.png", // add +image
    "msx":"msx.svg", 
    "msx1":"msx1.svg", 
    "msx2":"msx2.svg", 
    "msx2+":"msx2+.svg", 
    "msxturbor":"msxturbor.png", 
    "mugen":"mugen.png", 
    "multivision":"multivision.png", 
    "n64":"n64.svg", 
    "n64br":"n64br.webp", //add +image
    "n64dd":"n64dd.png", 
    "namco":"namco.svg", 
    "namco22":"namco22.png", 
    "naomi":"naomi.svg", 
    "naomi-w":"naomi-w.svg", 
    "naomi2":"naomi2.png", 
    "nds":"nds.svg", 
    "neogeo":"neogeo.svg", 
    "neogeocd":"neogeocd.svg", 
    "neogeocd-w":"neogeocd-w.svg", 
    "neogeomvs":"neogeomvs.png", 
    "nes":"nes.svg", 
    "nesbr":"nesbr.svg", //add +image
    "nes-w":"nes-w.svg", 
    "nesh":"nesh.webp", //add +image
    "neshd":"neshd.webp", //add +image
    "ngp":"ngp.svg", 
    "ngpc":"ngpc.svg", 
    "ngpc-w":"ngpc-w.svg", 
    "nichibutsu":"nichibutsu.png", 
    "nintendo":"nintendo.svg", 
    "nmk":"nmk.png", 
    "o2em":"o2em.webp", //add +image
    "odcommander":"odcommander.png", //add +img
    "odyssey2":"odyssey2.svg", 
    "openbor":"openbor.png", 
    "oric":"oric.svg", 
    "oric-w":"oric-w.svg", 
    "pc":"pc.svg", 
    "pc88":"pc88.svg", 
    "pc88-w":"pc88-w.svg", 
    "pc98":"pc98.svg", 
    "pc98-w":"pc98-w.svg", 
    "pce-cd":"pce-cd.svg", 
    "pcengine":"pcengine.svg", 
    "pcenginecd":"pcenginecd.png", // add +image
    "pcfx":"pcfx.svg", 
    "pcfx-w":"pcfx-w.svg", 
    "pet":"pet.svg", 
    "pico8":"pico8.svg", 
    "playchoice":"playchoice.png", 
    "pokemini":"pokemini.svg", 
    "ports":"ports.svg", 
//    "ports":"ports.webp", //add +image
    "ports1":"internet.png", //add
    "prboom":"prboom.svg", 
    "ps2":"ps2.svg", 
    "ps2-w":"ps2-w.svg", 
    "ps3":"ps3.svg", 
    "ps3-w":"ps3-w.svg", 
    "psikyo":"psikyo.svg", 
    "psp":"psp.svg", 
    "psx":"psx.svg", 
    "psx-w":"psx-w.svg", 
    "psxbr":"psxbr.webp", //add +image
    "pygame":"pygame.png", 
    "residualvm":"residualvm.svg", 
    "retrobat":"retrobat.png", 
    "retrobat":"retrobat.svg", 
    "samcoupe":"samcoupe.svg", 
    "sammy":"sammy.svg", 
    "samurai":"samurai.png", //add +image
    "satellaview":"satellaview.svg", 
    "satellaview-w":"satellaview-w.svg", 
    "saturn":"saturn.svg", 
    "sbg":"sbg.svg", // add +image
    "scummvm":"scummvm.svg", 
    "scv":"scv.svg", 
    "sdlpop":"sdlpop.svg", 
    "sega":"sega.png", 
    "sega":"sega.svg", 
    "sega32x":"sega32x.svg", 
    "sega32x-w":"sega32x-w.svg", 
    "segacd":"segacd.svg", 
    "segastv":"segastv.png", 
    "seibukaihatsu":"seibukaihatsu.png", 
    "semicom":"semicom.png", 
    "seta":"seta.png", 
    "sfc":"sfc.png", // add Super Famicom+Image
    "sg-1000":"sg-1000.svg", 
    "sg1000":"sg-1000.svg", // add
    "sgb":"sgb.svg", // add +image
    "shmups":"shmups.png", // add +image
    "snes":"snes.svg", 
    "snes-msu":"snes-msu.png", 
    "snes-msu1":"snes-msu1.svg", 
    "snesbr":"snesbr.webp", //add +image
    "snesh":"snesh.webp", //add +image
    "snesj":"snesj.png", //add +image
    "snk":"snk.svg", 
    "solarus":"solarus.svg", 
    "spectravideo":"spectravideo.svg", 
    "spectravideo-w":"spectravideo-w.svg", 
    "steam":"steam.svg", 
    "stratagus":"stratagus.svg", 
    "street":"street.png", //add +image
    "sufami":"sufami.svg", 
    "superbroswar":"superbroswar.png", //add +img
    "supergrafx":"supergrafx.svg", 
    "supervision":"supervision.png", 
    "switch":"switch.png", 
    "taito":"taito.svg", 
    "taitox":"taitox.png", 
    "technos":"technos.png", 
    "tecmo":"tecmo.svg", 
    "teknoparrot":"teknoparrot.png", 
    "tg-cd":"tg-cd.svg", 
    "tg16":"tg16.svg", 
    "thomson":"thomson.svg", 
    "thomson-w":"thomson-w.svg", 
    "ti99":"ti99.svg", 
    "tic80":"tic80.svg", 
    "tic80-w":"tic80-w.svg", 
    "toaplan":"toaplan.png", 
    "triforce":"triforce.png", 
    "trs-80":"trs-80.svg", 
    "turbografx":"turbografx.webp", //add +image
    "tyrquake":"tyrquake.png", //add +image
    "universal":"universal.png", 
    "uzebox":"uzebox.svg", 
    "vectrex":"vectrex.svg", 
    "vectrex-w":"vectrex-w.svg", 
    "vic20":"vic20.png", 
    "videopac":"videopac.svg", 
    "virtualboy":"virtualboy.svg", 
    "visco":"visco.png", 
    "vpinball":"vpinball.png", 
    "vsc":"vsc.png", 
    "wheroes":"wheroes.png", // add +image
    "wii":"wii.svg", 
    "wii-w":"wii-w.svg", 
    "wiiu":"wiiu.svg", 
    "wiiu-w":"wiiu-w.svg", 
    "windows":"windows.svg", 
    "windows_installers":"windows_installers.png", //add +image
    "wonderswan":"wonderswan.svg", 
    "wonderswan-w":"wonderswan-w.svg", 
    "wonderswancolor":"wonderswancolor.svg",
    "wonderswancolor-w":"wonderswancolor-w.svg", 
    "wswan":"wonderswan.svg", //add
    "wswanc":"wonderswancolor.svg", //add
    "x1":"x1.svg", 
    "x1-w":"x1-w.svg", 
    "x68000":"x68000.svg", 
    "xash3d_fwgs":"xash3d_fwgs.svg", 
    "xbox":"xbox.svg", 
    "xbox360":"xbox360.png", 
    "youtube":"youtube.png", //add +image
    "zmachine":"zmachine.svg", 
    "zx81":"zx81.svg", 
    "zx81-w":"zx81-w.svg", 
    "zxspectrum":"zxspectrum.svg", 
    "zxspectrum-w":"zxspectrum-w.svg", 
    "aplicativos":"aplicativos.png", //add +image
    "dos":"dos.png", //add +image
    "famicom":"famicom.svg", //add +image
    "iptv":"iptv.png", //add +image
    "retrogames":"retrogames.jpg", //add +image
    "segah":"segah.png", //add +image
    "tmntsr":"tmntsr.png", //add +image
    "ports11":"ports.webp", //add +image
};