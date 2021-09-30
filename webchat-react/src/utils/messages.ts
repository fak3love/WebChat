import {RawMessage} from "../pages/Messages/Messages";

export function build(messages: RawMessage[]) {
    const sections: Array<{date: string, messages: RawMessage[]}> = [];

    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];

        if (i - 1 >= 0) {
            const current = new Date(message.writtenDate).getDay();
            const previous = new Date(messages[i - 1].writtenDate).getDay();

            if (current !== previous)
                sections.splice(0, 0, {date: message.writtenDate, messages: []});

            sections[0].messages.push(message);
            continue;
        }

        sections.splice(0,0, {date: message.writtenDate, messages: [message]});
    }

    return sections;
}