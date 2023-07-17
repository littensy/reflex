import { producer } from "server/producer";

// The client and server should output the same final state

for (const _ of $range(1, 150)) {
	for (const _ of $range(1, 10)) {
		if (math.random() > 0.5) {
			producer.incrementShared();
		} else {
			producer.multiplyShared(5 * (math.random() - 0.5));
		}
	}
	task.wait(math.random() - 0.8);
}
