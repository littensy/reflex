import { producer } from "./producer";
import { selectCount } from "./producer/counter.producer";
import { selectText } from "./producer/writer.producer";

producer.subscribe((state) => {
	print(`[example]: State changed to ${game.GetService("HttpService").JSONEncode(state)}`);
});

producer.subscribe(selectCount, (count, prevCount) => {
	print(`[example]: Count changed from ${prevCount} to ${count}`);
});

producer.subscribe(selectText, (text, prevText) => {
	print(`[example]: Text changed from "${prevText}" to "${text}"`);
});

producer.increment();
producer.write("Hello, ");
producer.write("World!");
