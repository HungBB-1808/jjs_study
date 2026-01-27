package com.nihongo.backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Repository
interface CardRepository extends JpaRepository<Card, Long> {}

// Controller
@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
public class CardController {
    private final CardRepository repository;

    public CardController(CardRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Card> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Card create(@RequestBody Card card) {
        card.setNextReviewAt(java.time.LocalDateTime.now());
        return repository.save(card);
    }
}