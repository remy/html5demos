# HTML5 Demos and Examples

A collection of HTML5 experiments I've created, now open source and on GitHub, so please go ahead and help me hack this resource in to a wealth of demos that other authors can learn from.

## Aim

* If a user can hit view source on the demo, then we've done our job
* Where possible browser support should be named (FF3.5, etc)
* All content is open source and content is [Creative Commons Share Alike 2.0](http://creativecommons.org/licenses/by-sa/2.0/uk/)
* Individual demos, if authored by someone other than [@rem](http://twitter.com) can be credited as appropriate

# Creating new demos

If the demo should take the default style - currently grey and dull - but it keeps the focus on the code ;) then follow these instructions. Otherwise, simply create the file in the root directory calling it [yourdemo].html and include it in the index.php.

Instructions to creating a new demo:

* Create a .html in the /demos directory
* Use the following template (also a sample in /demos/template.html):

<pre><code>&lt;title&gt;&lt;!-- Title of your demo, note this appears in the document title prefixed with &quot;HTML5 Demo:&quot; --&gt;&lt;/title&gt;
&lt;style&gt;/** any custom styles live here **/&lt;/style&gt;
&lt;article&gt;&lt;!-- any demo markup here --&gt;&lt;/article&gt;
&lt;script&gt;
// your JavaScript
&lt;/script&gt;</code></pre>

* When requesting the demo, use html5demos.com/[yourdemo] and page.php will top and tail your page
* Any additional JavaScript libraries should be stored in the /js directory, assets, such as video and audio live in the /assets directory.

That should be it. 

By submitting any code, you're also agreeing that your code is covered by the MIT-LICENSE that this project is covered by, and all content is covered by Creative Commons Share Alike 2.0 - as is all of this project: it's all about sharing baby!

# TODO

## Demos Required

* Microdata
* SVG
* More audio and video demos
* More introductions to canvas
* More event based stuff
* WebSockets (@rem - have a demo ready, but not the server side)

## Misc

* Clearer versioning on the demos, rather than "All bar Opera", should include last version to support feature, i.e. Opera 10.10b, Chrome 4 dev, Safari 4.0, etc.
