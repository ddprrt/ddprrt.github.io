---
title: "Learning Rust and Go"
categories:
- Rust
- Go
---

My blog is a chronicle of learning new things. Most of the articles I write are notes on how I solved problems that I found in my everyday work. And every now and then I have to urge to learn something new!

Due to my overall weariness with web development in general, I decided to go back to what I did 15-20 years ago, and do some native systems-level programming again. If you read my [newsletter](/newsletter), you might know that I dabbled in both Rust and Go recently.

It's interesting how both Go and Rust fall into the same category but are so fundamentally different in design, philosophy, and execution.

Here are some insights from using both for quite a while.

## Hey, ho, let's Go!

I got lured into Go by listening to Carmen Andoh, who said that "Go made programming fun!".

Go feels like "What if everything since C++ just wouldn't have happened? Including C++!" - no classes, no cruft. No OO patterns. Focussed code, natively compiled. Simple, straightforward. A sequel to C.

And I like C! 

The creators of Go know how to play the C card. One of its creators is Ken Thompson of UNIX fame, who was in the same team as C's original author Dennis Ritchie. The book "The Go Programming Language" was written by Brian Kernighan, who has also written "The C Programming Language", as he was a colleague of both Ritchie and Thompson.

But there are also Pascal influences, which make a lot of sense if you know the history of the creators.

They know their heritage. They've seen programming languages evolve. They want to take an alternative route where you get most of the benefits of modern programming languages, without losing focus nor performance.

### Coding Detox

My friend Rainer has called Go "Coding Detox". And this is a very fitting term because you have to unlearn a lot of cruft programming languages added in the last couple of years. Your code becomes more verbose, but inevitably also a lot more readable.

And it's true! Even if you don't know how to write Go, if you have a little bit of knowledge from other programs, you will be able to read Go code. It's that simple. Yes, Go can be a little verbose at times, but again: This makes it just so much easier to read as every step is very intentional.

The following snippet takes N random numbers out of a pot of M. I didn't need to understand most of the inner mechanics of Go to create something like this.

```go
func takeNFromM(take int, from int) []int {
	result := make([]int, take)
	for i := 0; i < take; i++ {
		source := rand.NewSource(time.Now().UnixNano())
		rando := rand.New(source)
		result[i] = rando.Intn(from) + 1
	}
	sort.Ints(result)
	return result
}
```

I like this fact about Go a lot. The way Go works *by design* is very similar to how I write JavaScript. So for me, it's very easy to hop on. The reduced syntax allows focusing more on the things that actually matter: Structure, architecture, performance.

### Tooling

One thing I noticed immediately is how amazing tooling is. I know we've come far with JavaScript tooling recently. But hey, it's still nothing compared to what Go provides.

The Go binary comes with all the tools you need to build, run, format, and test your code. And it's super fast. If you install the Go extensions for VS Code, you get a snappy editing experience that outperforms everything I've seen so far. Just a couple of clicks and you're done: auto-complete, auto-importing, auto-formatting, debugging. All just like that!

Thanks to the great Intellisense, I only needed a faint idea of which package from the standard library I wanted to import. `math/rand` and `time` for proper random generators. That's just there by typing a couple of letters.

### Loves

There are some things I absolutely love:

1. OO without BS. No weird inheritance patterns or reliance on abstractions where they aren't necessary. Structs and methods you call on structs. The methods look and work like regular functions if you want to. Just like I write my JavaScript.
2. The standard library is huge and takes care of a ton of things that you encounter in your everyday programming life.
3. Heavily opinionated without losing expressiveness.

### Worries

With all the excitement, there are a couple of things that worry me:

1. There are `nil` values and pointers. I know that they behave differently and are a lot safer than what I know from C, but it still feels like I can do something wrong where I shouldn't, giving that everything else is managed.
2. Downloading packages from GitHub is something I have to get used to.
3. From time to time I miss some higher-level abstractions like iterators or a more expressive type system, but hey. That's part of their philosophy!

### How to start learning

Bryan Cantrill once said that JavaScript is "LISP in C's clothing". There's much truth to it. The relation to Java is more accidental than intentional. There are a lot of LISP-isms in JS that are approachable through the familiar syntax. In a way, this makes JavaScript a managed C sequel.

If I look from this angle, Go falls into a similar category. A sequel to C, managed, cleaned, for modern applications.

I think a good way to start if you want to get into some production-ready code would be to convert your Node applications to Go. Especially web servers and the like, things you usually need Express or Fastify for.

Go has a tremendous HTTP package where you work with a similar API to create your servers. Try that out!

If that's not your thing, I guess everything, where you need to transform JSON, XML, or any other file into something, is a good way to start to get your hands dirty with Go.

## Rags to Rags, Rust to Rust

I heard the first time about Rust from Ryan Levick, who was a guest at our [Working Draft](https://workingdraft.de) podcast on Web Assembly, but couldn't stop raving about Rust!

Rust has become quite popular in the last couple of years, which I still find interesting because compared to every other modern programming language there's a *lot* to learn when you want to be productive in Rust.

Rust comes with a rich, C-like syntax that looks very imperative at first, but at a closer look has lots of bonds to functional programming. Given that the original compiler was written in OCaml, this should come as no surprise. 

This gives you as a developer constructs like a pattern matching, rich types through enums, iterators that you can work with imperatively, and so on.

Once you get the hang of it, it's an exceptionally nice language. It's elegant, modern, reads wonderfully given that you work on tasks that are so close to the metal.

The following code example does the same thing as the Go snippet above, but it feels a lot more fluent:

```rust
fn take_n_from_m(take: usize, from: u64) -> Vec<u64> {
    let mut rng = rand::thread_rng();
    let mut nums: Vec<u64> = (1..=from).collect();
    nums.shuffle(&mut rng);
    nums[0..take].to_vec()
}
```

### Memory

Just as Go, Rust wants to know how would programming languages look like if there wasn't the C++, Java, etc. detour. But instead of giving you the benefits of managed memory, Rust gives you memory safety through syntax and semantics. At compile time.

To me, this concept is absolutely new. It basically says that for every piece of memory, there just can be one owner at a time. Everything else is just borrowing that piece of memory for a period of time, with the guarantee that they're returning it to its original owner, or becoming a new owner.

Much like borrowing a book from somebody. This analogy works exceptionally well. This is also something that needs a lot of learning.

Turns out that since the dawn of high-level programming languages, a lot of abstractions have happened, from the simplest multiplication to reassignments, etc.

Suddenly you have to think a lot about memory. Basically, all the time until the patterns become native to you.

And this feels exceptionally good. You have the feeling that you are in absolute control of low-level memory management, without worrying at all that you could break something. This is astonishing!

### Debugging at compile time

This also leads to a philosophy that I once heard as "debug at compile time". Instead of finding out errors when they happen, you catch a lot of them during development, when you try to compile your code.

You are going to argue with your compiler a lot. But the compiler is nice. It gives you hints on what you can try, what you could have possibly meant. This is a wonderful dialog, almost pair-programming style.

And all of a sudden, you start understanding what happens with the memory underneath. And you start optimizing for it. And your program becomes a lot faster than you would expect.

One task from [exercism.io](https://exercism.io) had a test suite that took well over 45 seconds given my poor implementation. A couple of optimizations later, the whole suite was done in less than a second.

I felt almighty!

### Zero-cost abstractions

The idea of zero-cost abstractions is omnipresent. For example, the usage of iterators, which can be used in a functional programming style as well as in an imperative style.

You can switch between both styles to your liking and still have the feeling that you are writing performant code. It also gives you a better feeling of what happens when you call an iterator.

The same goes for the rich type system and their traits. You realize what makes a number a number, and how it's represented in the type system. And the more you work with this, you see how these types help mostly with providing the compiler with enough information so it is able to generate the most performant assembly code.

### Loves

What do I like most about Rust?

1. Traits and types. This gives a totally new spin on object orientation that I wouldn't even dare to call OO.
2. Their package system (called *crates*) has some immensely useful utilities that I would've loved in any other language. Since iterators are so important for everything you do, `itertools` are something I wouldn't want to miss.
3. Just like Go, Rust is very opinionated where it matters!
4. Honestly? The community. I'm organizing [Rust Linz](https://rust-linz.at) with some folks, and I was baffled how welcoming and careful everybody is. The Rust folks take care of things!
5. Rust gains importance in the industry. Thankfully it's not in the hand of a single corporation but has a foundation backing it.

### Worries

If there's one thing that worries me then it's the package management. Crates and cargo are something that is very welcomed by the community. Nice things, like all the JavaScript developers, have. It's good that [crates.io](https://crates.io) is not another packaging company like NPM is, but I see some of the same patterns that backfired in Node and NPM at some point:
   1. Too many important packages at a 0.x version.
   2. Big dependency trees that you pull in without knowing.
   3. Many things that do the same!

I hope that this is just an impression, and won't go in the same direction as Node. I think this is important, as a lot of functionality you would expect being shipped with the language in some sort of standard library is usually extracted into crates: Random numbers, TCP networking, etc. You rely on crates *a lot*.

Another thing that strikes me kinda odd is macros. They're nice and useful, but you theoretically have the possibility to create your own meta-language with it. Somebody even created a [JSX macro in Rust](https://yew.rs/docs/en/concepts/components#view). This is not a bad thing per se, but given that most dependencies are 0.x, and that the language has already quite a bunch of syntax and concepts to learn, I fear that there will be too much noise that makes it hard to focus and to decide what to use for your production apps.

Other than that, I have no worries. It's a beautiful language and I enjoy writing it a lot!

### Learning Rust

I guess it won't be that easy to just port over some Node apps to Rust, even though there are crates that just work like Express. [Rocket for example](https://rocket.rs).

I learned Rust by looking at [exercism.io](https://exercism.io) and making some programming 101 exercises, where I could focus on learning the language, its syntax, and its semantics without worrying too much about the problem at hand. It's nice for a change to generate Fibonacci numbers or find primes.

Half-way through the course, I knew that I needed some real project to chew on. I'm mostly working on distributing network requests to other services and orchestrating said services. It turns out that's a perfect use-case for Rust. But I guess so are other things. I really see no limit.

## Rust or Go? Rust and Go!

Rust and Go to me are a welcome distraction right now. It's good to do something entirely different from what I've done before, and both languages have their way of bringing me to my goals. Right now I couldn't say which one I would prefer for which task, as both are so appealing to me. Maybe this decision comes once I run into problems that I would be able to solve with ease in the opposite language.

But hey, why choosing? Maybe I will continue to use both!
