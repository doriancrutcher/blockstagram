/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::collections::Vector;
use near_sdk::{env, near_bindgen, setup_alloc};

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Blockstagram {
    records: LookupMap<String, String>,
    locationAddress: LookupMap<String, Vec<String>>,
    captions: LookupMap<String, String>,
    users: LookupMap<String, Vec<String>>,
}

impl Default for Blockstagram {
    fn default() -> Self {
        Self {
            records: LookupMap::new(b"a".to_vec()),
            locationAddress: LookupMap::new(b"a".to_vec()),
            captions: LookupMap::new(b"a".to_vec()),
            users: LookupMap::new(b"a".to_vec()),
        }
    }
}

#[near_bindgen]
impl Blockstagram {
    pub fn set_greeting(&mut self, message: String) {
        let account_id = env::signer_account_id();

        // Use env::log to record logs permanently to the blockchain!
        env::log(format!("Saving greeting '{}' for account '{}'", message, account_id,).as_bytes());

        self.records.insert(&account_id, &message);
    }

    // `match` is similar to `switch` in other languages; here we use it to default to "Hello" if
    // self.records.get(&account_id) is not yet defined.
    // Learn more: https://doc.rust-lang.org/book/ch06-02-match.html#matching-with-optiont
    pub fn get_greeting(&self, account_id: String) -> String {
        match self.records.get(&account_id) {
            Some(greeting) => greeting,
            None => "Hello".to_string(),
        }
    }

    pub fn hi(&mut self) {
        self.records
            .insert(&String::from("dor"), &String::from("hi"));
    }

    // Storing ipfs data addresses
    pub fn add_data_address(&mut self, account_id: String, address: String) {
        if self.locationAddress.contains_key(&account_id) {
            let mut existing_array = Vec::new();
            match self.locationAddress.get(&account_id) {
                Some(array) => existing_array = array,
                None => println!("no Array"),
            };

            existing_array.push(address);

            self.locationAddress.insert(&account_id, &existing_array);
        } else {
            let new_array: Vec<String> = vec![String::from(&address)];
            self.locationAddress.insert(&account_id, &new_array);
        }
    }

    pub fn get_data_addresses(self, account_id: String) -> Vec<String> {
        match self.locationAddress.get(&account_id) {
            Some(address) => address,
            None => vec![],
        }
    }

    // Storing Captions per address

    pub fn store_caption(&mut self, address: String, caption: String) {
        self.captions.insert(&address, &caption);
    }

    pub fn get_caption(self, address: String) -> String {
        match self.captions.get(&address) {
            Some(caption) => caption,
            None => String::from(""),
        }
    }

    pub fn store_user(&mut self, user: String) {
        let user_list_key: String = String::from("all users");

        match self.users.get(&user_list_key) {
            Some(mut user_list) => {
                user_list.push(user);
                self.users.insert(&user_list_key, &user_list);
            }
            None => {
                let first_user = vec![user];
                self.users.insert(&user_list_key, &first_user);
            }
        };
    }

    pub fn get_user_list(self) -> Vec<String> {
        let user_list_key: String = String::from("all users");

        match self.users.get(&user_list_key) {
            Some(user_list) => user_list,
            None => vec![],
        }
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
