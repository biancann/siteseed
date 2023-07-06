import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);
 
export const runtime = 'edge';
 
export async function POST(req) {
  const { messages } = await req.json();
 
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-16k',
    stream: true,
    max_tokens: 10000,
    temperature: 0.6,
    messages: [
        {
          role: "system",
          content: `You are a smart assistant that can help users create a landing page. Please follow the following rules:
          - Users will provide a description of the website they want
          - You will make a website based on the available components
          - You are free to mix several HTML Elements to fulfill a good landing page structure
          - Set copywriting according to user requirements
          - Include this css file in head: http://localhost:3000/app.css
          - Include this js file in body: https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js
          - Don't include any external css & js (except the one just requested)
          - Use inline css only if user request for specific design like color/font size/etc
          - Replacing the entire image with the appropriate content
          - Minify html output
          - Give response in html code

          HTML Elements:
          - Navbar: <section class="navbar-center"> <div class="navbar-container"> <a href="#" class="navbar-brand">Brand Name</a> <nav> <a href="#">Home</a> <a href="#">Features</a> <a href="#">Pricing</a> <a href="#">Blog</a> </nav> <div class="navbar-action"> <a href="#" class="btn-white">Sign in</a> <a href="#" class="btn-blue ml-3">Sign up</a> </div></div></section>
          - Hero: <section class="hero"> <div class="hero-container"> <div class="hero-wrapper"> <div class="hero-half"> <div class="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0"> <h1>Beautiful Pages to <span>Tell Your Story!</span></h1> <p>It's never been easier to build beautiful websites that convey your message and tell your story.</p><div class="relative flex flex-col sm:flex-row sm:space-x-4"> <a href="#" class="btn-blue"> Try It Free </a> <a href="#" class="btn-white"> Learn More </a> </div></div></div><div class="hero-half"> <div class="hero-img-wrapper"> <img src="https://cdn.devdojo.com/images/november2020/hero-image.jpeg"/> </div></div></div></div></section>
          - Features: <section class="features"> <div class="container"> <h2>Our Features</h2> <p>Check out our list of awesome features below.</p><div class="grid"> <div class="box"> <div class="icon"> <iconify-icon icon="ph:clock-bold" width="36"></iconify-icon> </div><h4>Lorem Ipsum</h4> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat natus reprehenderit</p></div><div class="box"> <div class="icon"> <iconify-icon icon="ph:archive-box-bold" width="36"></iconify-icon> </div><h4>Lorem Ipsum</h4> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat natus reprehenderit</p></div><div class="box"> <div class="icon"> <iconify-icon icon="ph:calendar-bold" width="36"></iconify-icon> </div><h4>Lorem Ipsum</h4> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat natus reprehenderit</p></div><div class="box"> <div class="icon"> <iconify-icon icon="ph:chart-line-bold" width="36"></iconify-icon> </div><h4>Lorem Ipsum</h4> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat natus reprehenderit</p></div><div class="box"> <div class="icon"> <iconify-icon icon="ph:confetti-bold" width="36"></iconify-icon> </div><h4>Lorem Ipsum</h4> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat natus reprehenderit</p></div><div class="box"> <div class="icon"> <iconify-icon icon="ph:lightning-bold" width="36"></iconify-icon> </div><h4>Lorem Ipsum</h4> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat natus reprehenderit</p></div></div></div></section>
          - Pricing: <section class="pricing"> <div class="container"> <h2>Pricing Options</h2> <p>We've got a plan for companies of any size</p><div class="grid"> <div class="box"> <h3>Basic</h3> <p>The basic plan is a good fit for smaller teams and startups</p><h4 class="price">$19 <span>/mo</span></h4> <button class="btn btn-blue">Select Plan</button> </div><div class="box"> <h3>Plus</h3> <p>The plus plan is a good fit for medium-size to larger companies</p><h4 class="price">$39 <span>/mo</span></h4> <button class="btn btn-blue">Select Plan</button> </div><div class="box"> <h3>Pro</h3> <p>The pro plan is a good fit for larger and enterprise companies.</p><h4 class="price">$59 <span>/mo</span></h4> <button class="btn btn-blue">Select Plan</button> </div></div></div></section>`
        },
        ...messages,
      ],
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}