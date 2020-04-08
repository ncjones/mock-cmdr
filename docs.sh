#!/bin/sh

rm -rf docs
yarn jsdoc

# remove empty globals nav
sed -i.bak 's/<a href="global.html">Global<\/a>//' docs/*.html

# disable active highlighting
sed -i.bak 's,<script src="scripts/pagelocation.js"></script>,,' docs/*.html

# add parens after method names in nav menu
sed -i.bak 's,>init</a,>init()</a,g' docs/*.html
sed -i.bak 's,>reset</a,>reset()</a,g' docs/*.html
sed -i.bak 's,>defineCmd</a,>defineCmd()</a,g' docs/*.html
sed -i.bak 's,>loadCmds</a,>loadCmds()</a,g' docs/*.html
sed -i.bak 's,>createMapping</a,>createMapping()</a,g' docs/*.html
sed -i.bak 's,>findRequests</a,>findRequests()</a,g' docs/*.html
sed -i.bak 's,>cleanUp</a,>cleanUp()</a,g' docs/*.html


# add links to public members in nav menu
member_links="\
<li data-type='method' id='mock-cmdr-stub-nav'><a href='module-mock-cmdr.html#.stub'>stub<\/a><\/li>\
<li data-type='method' id='mock-cmdr-find-nav'><a href='module-mock-cmdr.html#.find'>find<\/a><\/li>\
"
sed -i.bak "s/<ul class='methods'>/<ul class=methods>${member_links}/" docs/*.html
