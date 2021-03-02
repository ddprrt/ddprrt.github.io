---
title: "Learning Rust and Go"
categories:
- Rust
- Go
---

My blog is a chronicle of learning new things. Most of the articles I write are notes on how I solved problems that I found in my every day work. And every now and then I have to urge to learn something new!

Due to my overall weariness with web development in general, I decided to go back to what I did 15-20 years ago, and do some native systems-level programming again. If you read my [newsletter](/newsletter), you might know that I dabbled in both Rust and Go recently.

It's interesting how both Go and Rust fall into the same category, but are so fundamentally different in design, philosphy, and execution.

Here are some insights from using both for quite a while.

## Hey, ho, let's Go!

Go feels like "What if everything since C++ just wouldn't have happenend? Including C++!" - no classes, no cruft. No OO patterns. Focussed code, natively compiled. Simple, straightforward. A sequel to C.

And I like C! 

The creators of Go know how to play the C card. One of its creators is Ken Thompson of UNIX fame, who was in the same team as C's original author Dennis Ritchie. The book "The Go Programming Language" was written by Brian Kernighan, who has also written "The C Programming Language", as he was a colleague of both Ritchie and Thompson.

But there's also Pascal influences, which make a lot of sense if you know the history of the creators.

They know their heritage. They've seen programming languages evolve. They want to take an alternative route where you get most of the benefits of modern programming languages, without losing focus nor performance.

### Coding Detox

My friend Rainer has called Go "Coding Detox". And this is a very fitting term, because you have to unlearn a lot of cruft programming languages added in the last couple of years. Your code becomes more verbose, but inevitably also a lot more readable.

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

I like this fact about Go a lot. The way Go works *by design* is very similar to how I write JavaScript. So for me, it's very easy to hop on. The reduced syntax allows to focus more on the things that actually matter: Structure, architecture, performance.

### Tooling

One thing I noticed immediately is how amazing tooling is. I know we've come far with JavaScript tooling recently. But hey, it's still nothing compared to what Go provides.

The Go binary comes with all the tools you need to build, run, format, and tes your code. And it's super fast. If you install the Go extensions for VS Code, you get a snappy editing experience that outperforms everything I've seen so far. Just a couple of clicks and you're done: auto-complete, auto-importing, auto-formatting, debugging. All just like that!

Thanks to the great Intellisense, I only needed a faint idea of which package from the standard library I wanted to import. `math/rand` and `time` for proper random generators. That's just there by typing a couple of letters.

### Loves

There are some things I absolutely love:

1. OO without BS. No weird inheritance patterns or reliance on abstractions where they aren't necessary. Structs and methods you call on structs. The methods look and work like regular functions if you want to. Just like I write my JavaScript.
2. The standard library is huge and takes care of a ton of things that you encouter in your everyday programming life.
3. Heavily opinonated without losing expressiveness.

### Worries

With all the excitement, there are a couple of things that worry me:

1. There are `nil` values and pointers. I know that they behave different and are a lot more safe than what I know from C, but it still feels like I can do something wrong where I shouldn't, giving that everything else is managed.
2. Downloading packages from GitHub is something I have to get used to.
3. From time to time I miss some higher level abstractions like iterators or a more expressive type system, but hey. That's part of their philosophy!

### How to start learning

Bryan Cantrill once said that JavaScript is "LISP in C's clothing". There's much truth to it. The relation to Java is more accidental than intentional. There are a lot of LISP-isms in JS that are appraochable through the familiar syntax. In a way, this makes JavaScript a managed C sequel.

If I look from this angle, Go falls into a similar category. A sequel to C, managed, cleaned, for modern applications.

I think a good way to start if you want to get into some production-ready code would be to convert your Node applications to Go. Especially web servers and the like, things you usually need Express or Fastify for.

Go has a tremendous HTTP package where you work with a similar API to create your servers. Try that out!

If that's not your thing, I guess everything where you need to transform JSON, XML or any other file into someting is a good way to start to get your hands dirty with Go

## Rags to Rags, Rust to Rust
