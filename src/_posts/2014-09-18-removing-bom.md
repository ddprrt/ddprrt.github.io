---
title: "Removing Byte Order Marks"
published: true
categories:
- PHP
permalink: /snippets/php/removing-byte-order-marks/
---

One special version of Excel for instance still adds those nasty buggers.

```php
$str = file_get_contents("input_file_with_bom.csv");

$str = str_replace("\xEF\xBB\xBF","",$str);

file_put_contents("output_file_without_bom.csv");
```
