<template>
  <div class="relative font-body text-foreground">
    <h2>About Me</h2>
    <p>
      I am a scientist, engineering leader, and software developer. I have a PhD in molecular biophysics, a master's
      degree in computer science, and over two decades of experience building reliable software systems for research,
      healthcare, and business. I enjoy solving complex problems, collaborating with smart people, and building products
      that matter to human beings and the planet.
    </p>
    <p>
      As a scientist at [Genentech](https://www.gene.com/), I built the protein annotation system that integrated and
      routinely updated carefully provenanced data from over 60 sources and was used by scientists and legal teams for
      over a decade – the same kind of multi-source reconciliation and provenance problem that a trustworthy civic data
      corpus demands. Later, I managed Research Computing, with a matrixed team of approximately 20 IT professionals and
      an annual equipment and services budget of $30M. At [Invitae](https://www.invitae.com/), I was a member of the
      small initial team that built the laboratory methods and systems that sequenced and delivered diagnostic genomics
      reports to over six million patients and their clinicians before the company was acquired by LabCorp. I was
      directly involved in hiring the first \~50 engineers as the company scaled to roughly 750 by the time of my
      departure. As CTO at [MyOme](https://myome.com/), I architected and managed the implementation of a system for
      clinical genetics test ordering, processing, and interpretation that was nimble enough to adapt as the company
      found product-market fit; I was responsible for all aspects of the system, including security, data engineering,
      workflow systems, implementation, and compliance. I also hired multiple managers of managers in engineering,
      operations, and laboratory settings. I am the founder of [biocommons.org](http://biocommons.org), a volunteer-run
      community that builds pre-competitive open source tools for genome interpretation and that is trusted
      internationally for clinical genetics.
    </p>
    <p>
      Throughout my career, I have remained deeply technical and hands-on while simultaneously building focused and
      effective engineering teams with a palpable esprit de corps. I have expertise with Linux, Python, PostgreSQL, AWS,
      GCP, CI/CD pipelines, data engineering and pipelines, security, and devops. I am comfortable building scrappy
      solutions for quick answers and resilient systems for mission-critical operations, including systems that can
      scale up and down to meet fluctuating demand. I think strategically and have a bias toward action. And, over the
      last year, I have developed effective practices for thoughtfully using AI throughout product development,
      including brainstorming, competitive analyses, feature prioritization, product roadmapping, system architecture,
      implementation planning, and, of course, frontend and backend implementation. I am eager to bring these practices
      to Change.vote to facilitate cross-functional collaboration and accelerate product development.
    </p>
    <p>
      My political engagement is not new. In 2017, I began volunteering with [States Win](https://stateswin.org/) (then
      known as Sister District), including extensive canvassing in Arizona, co-organizing the canvassing effort in 2019,
      and leading a Virginia canvassing delegation that led to the VA trifecta. In 2020, I was a core member of the
      small, passionate, and all-volunteer team that built [landslide2020.org](http://landslide2020.org), a voter
      relational organizing platform. Most recently, I collaborated with others at Indivisible SF to build [No Kings
      Countdown](http://nokingscountdown.org/), a relational organizing tool to motivate people leading up to No Kings 3
      on March 28\. In the course of building these tools, I have used APIs and services from Alloy, Ballotpedia, Civic
      Engine, Congress.gov, and vote.org. I am a user of Issue Voter, Sway, We Vote, and, recently, Change.vote.
    </p>
    <p>
      I have been dismayed by the political consequences of the decline in civic engagement, and I am compelled to use
      my skills and experience to counter this trend. Now that my children are in college, I am ready to dedicate myself
      full-time to this all-hands-on-deck moment by redirecting my career toward building tools that engage voters and
      improve participation.
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({ title: 'About · Reece Hart' })

const isDev = import.meta.dev

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .limit(5)
    .all(),
)

const { data: enjoyPhrasesData } = await useAsyncData('enjoy-phrases', () =>
  queryCollection('enjoyPhrases').first(),
)
const enjoyPhrases = computed(() => enjoyPhrasesData.value?.phrases ?? [])

const whatIDo = [
  { title: 'Build', body: 'I design and build software systems that are robust, maintainable, and actually used.' },
  { title: 'Understand', body: 'I dig into complex problems, make sense of the messy parts, and find the signal.' },
  { title: 'Collaborate', body: 'I work with smart people across disciplines to ship things that matter.' },
]
</script>
