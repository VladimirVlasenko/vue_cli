<template>
    <v-dialog width="400px" v-model="modal">
        <v-btn class="warning" flat slot="activator">Edit</v-btn>
        <v-card>
            <v-container>
                <v-layout row>
                    <v-flex xs12>
                        <v-card-title>
                            <h1 class="text--primary">Edit ad</h1>
                        </v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                            name="title"
                            label="Title"
                            type="text"
                            v-model="editedTitle"
                        ></v-text-field>
                        <v-text-field
                            name="description"
                            label="Description"
                            type="text"
                            multi-line
                            v-model="editedDescription"
                        ></v-text-field>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row>
                    <v-flex xs12>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="warning" @click="onCancel">Cancel</v-btn>
                            <v-btn class="success" @click="onSave">Save</v-btn>
                        </v-card-actions>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>  
</template>
<script>
/* eslint-disable */
export default {
    props: ['ad'],
    created () {
        console.log(this.ad)
    },
    data () {
        return {
            modal: false,
            editedDescription: this.ad.description,
            editedTitle: this.ad.title
        }
    },
    methods: {
        onCancel () {
            console.log(this.ad)
            this.modal = false
            this.editedDescription = this.ad.description
            this.editedTitle = this.ad.title
        },
        onSave () {
            if (this.editedDescription !== '' && this.editedTitle !== '') {

                this.$store.dispatch('updateAd', {
                    title: this.editedTitle,
                    description: this.editedDescription,
                    id: this.ad.id
                })

                this.modal = false
            }
        }   
    }
}
</script>