---
layout: default
title: "Blog"
permalink: /blog/
author_profile: true
---
# Blog Posts

{% for post in site.posts %}
  {% if post.published != false %}

<div class="post-preview">
  <h2>
    <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
  </h2>
  <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
  <div class="post-excerpt">
    {{ post.excerpt }}
  </div>
  <p><a href="{{ post.url | prepend: site.baseurl }}">Read more...</a></p>
  <hr>
</div>
  {% endif %}
{% endfor %}

<div class="coming-soon" markdown="1">

### More posts coming soon!

I'm working on several interesting blogs about related latest research. Stay tuned for regular updates!

Topics in the pipeline may include:

* Recent research advances in graph neural networks;
* The integration of large language models with graph-based reasoning;
* And much more...

</div>
{% if site.posts.size == 0 %}
No posts available yet. Stay tuned!
{% endif %}
