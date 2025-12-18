import { Event } from "../models/Event.js";

export const addEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.json(event);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Event not found" });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const deleted = await Event.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Event not found" });
        res.json({ message: "Event deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
