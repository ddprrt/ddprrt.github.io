---
title: "shared, util, core: Schroedinger's module names"
categories:
- TypeScript
- JavaScript
- Architecture
---

I do a lot of architecture work lately, and one thing that seems to appear more often than I thought it would be are module names that have generic-sounding names like *shared*, *util*, or *core*. There is something confusing about them, as they don't tell you what's inside!

I like to call them Schroedinger's module names. You only know what's inside when you take a look!

While this is something I found lately in JavaScript applications, this is of course not exclusive to JavaScript. Take other programming languages for example. Where would you expect to find a hash map? In Rust, it's `HashMap` in `std::collections`. In .NET you get a `Hashtable` in `System.Collections`. That's good. Hash maps are collections after all. 

In Java? It's `java.util`. How am I supposed to know to find that in *there*?

Folders (or modules) like this usually happen when there's functionality in your application that's so nice it might be useful for others, too: 

Types that are used by both your front-end and your API. Some nice transformation function that takes an object and makes it compatible with your views. Maybe some components that take care of the typical loading process &mdash; what a great utility!

The problem is that if you put them in modules that can contain everything, not only do you occlude your module's purpose, you also create a dumping ground for future functionality!

You can equally call the folders *stuff* and they would say the same thing.

## Purpose

Naming things is hard, and finding the purpose of your code can also show some architectural inadequacies: If there's no right place, maybe the architecture didn't account for what's coming, or it makes it super hard to introduce things.

But that doesn't need to be. For the examples above, it's not so hard to find something more speaking:

1. Types that you use in both your front-end and back-end? Maybe you mean *models*. That's generic as well, but tells you more about the purpose of what you find in there. Maybe you can tie your models to some bigger functionality. A *search* module for example can contain code for both your back-end and front-end, including the models. Let the tooling do the separation. 
2. Transformation functions? What about a module called *transforms*? That sounds like something that can be filled with more data-mangling functionality as you go on. The purpose is very clear: You want to transform your data objects. If you only end up with one transform, it might be wise to put that one close to the place where transformation actually happens. Don't be *DRY* just for the sake of it.
3. A loading spinner component and a defined process for handling loading states? That sounds like a nice *loading* module to me! Modules can be as small or as big as you need them. And if you think this is something incredibly essential, maybe it should be part of your design system!

There is *always* a better place to store your functionality.

## Exceptions

You can make avoiding module names like this a rule. And as with any rule, there are exceptions to it. Take the templating system *Handlebars* for example. In *Handlebars*, you can extend templating functionality using so-called *helpers*. That's a name I usually want to avoid, but in the context of *Handlebars*, it's pretty clear what to expect. This is where the architecture makes it unmistakably clear what the purpose of your *helpers* is, even though you have to learn *Handlebar*'s domain.

But other than that? Take it by their initials: shared, util, core? They *suc*! [*sic*]
