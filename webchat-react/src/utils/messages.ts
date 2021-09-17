import {MessageType} from "../components/Message/Message";

export function build(messages: Array<MessageType>) {
    const sections: Array<{date: string, messages: Array<MessageType>}> = [];

    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];

        if (i - 1 >= 0) {
            const current = new Date(message.writtenDate).getDay();
            const previous = new Date(messages[i - 1].writtenDate).getDay();

            if (current !== previous)
                sections.push({date: message.writtenDate, messages: []});

            sections[sections.length - 1].messages.push(message);
            continue;
        }

        sections.push({date: message.writtenDate, messages: [message]});
    }

    return sections;
}